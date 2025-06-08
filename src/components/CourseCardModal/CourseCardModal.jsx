import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import "./CourseCardModal.css";

const defaultForm = {
  title: "",
  description: "",
  duration: "",
  level: "",
  category: "",
  instructor: "",
  price: "",
  videoURL: [],
  curriculum: [
    {
      title: "",
      week: "",
      videos: [{ title: "", duration: "", videoUrl: "", isFree: false }],
    },
  ],
};

const CourseCardModal = ({ showModal, onClose, existingData }) => {
  const [form, setForm] = useState(existingData || defaultForm);
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setForm(existingData || defaultForm);
    setErrors({});
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "duration" || name === "week") {
      // Allow empty input
      if (value === "") {
        setForm({
          ...form,
          [name]: "",
        });
        setErrors({ ...errors, [name]: false });
        return;
      }

      // Allow only numbers and one decimal point
      // Regex explanation:
      // ^\d*\.?\d*$  — any digits, optionally one dot, then any digits again
      if (/^\d*\.?\d*$/.test(value)) {
        setForm({
          ...form,
          [name]: parseFloat(value),
        });
        setErrors({ ...errors, [name]: false });
      }
      // if invalid input, ignore the change (don't update state)
    } else {
      // For other fields, accept the input as is
      setForm({
        ...form,
        [name]: value,
      });
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleCurriculumChange = (index, field, value) => {
    const updated = [...form.curriculum];
    updated[index][field] = value;
    setForm({ ...form, curriculum: updated });
  };

  const handleVideoChange = (si, vi, field, value) => {
    const updated = [...form.curriculum];
    updated[si].videos[vi][field] = value;
    setForm({ ...form, curriculum: updated });
  };

  const addCurriculumSection = () => {
    setForm({
      ...form,
      curriculum: [
        ...form.curriculum,
        {
          title: "",
          week: "",
          videos: [{ title: "", duration: "", videoUrl: "", isFree: false }],
        },
      ],
    });
  };

  const addVideoToSection = (sectionIndex) => {
    const updated = [...form.curriculum];
    updated[sectionIndex].videos.push({
      title: "",
      duration: "",
      videoUrl: "",
      isFree: false,
    });
    setForm({ ...form, curriculum: updated });
  };

  const validateForm = () => {
    const newErrors = {};
    const messages = [];

    const check = (key, val, msg, refKey = null) => {
      if (!val?.toString().trim()) {
        newErrors[key] = true;
        messages.push(msg);
        if (!firstErrorRef.current) firstErrorRef.current = refKey || key;
      }
    };

    check("title", form.title, "Kurs nomi kiritilmagan.");
    check("instructor", form.instructor, "O‘qituvchi nomi kiritilmagan.");
    check("description", form.description, "Ta'rif kiritilmagan.");
    check("duration", form.duration, "Davomiylik kiritilmagan.");
    check("level", form.level, "Daraja tanlanmagan.");
    check("category", form.category, "Yo‘nalish tanlanmagan.");
    if (form.price === "" || isNaN(form.price) || form.price < 0) {
      newErrors.price = true;
      messages.push("Narx noto‘g‘ri kiritilgan.");
      if (!firstErrorRef.current) firstErrorRef.current = "price";
    }

    form.videoURL.forEach((url, i) => {
      if (!url.trim()) {
        messages.push(`Video URL ${i + 1} bo‘sh.`);
        newErrors[`videoURL-${i}`] = true;
        if (!firstErrorRef.current) firstErrorRef.current = `videoURL-${i}`;
      }
    });

    form.curriculum.forEach((section, si) => {
      if (!section.title.trim()) {
        messages.push(`${si + 1}-bo‘lim nomi yo‘q.`);
        newErrors[`section-title-${si}`] = true;
      }
      if (!section.week.trim()) {
        messages.push(`${si + 1}-bo‘lim haftasi yo‘q.`);
        newErrors[`section-week-${si}`] = true;
      }

      section.videos.forEach((video, vi) => {
        if (!video.title.trim())
          messages.push(`${si + 1}-bo‘lim, ${vi + 1}-video nomi yo‘q.`);
        if (!video.duration.trim())
          messages.push(`${si + 1}-bo‘lim, ${vi + 1}-video davomiyligi yo‘q.`);
        if (!video.videoUrl.trim())
          messages.push(`${si + 1}-bo‘lim, ${vi + 1}-video URL yo‘q.`);
      });
    });

    setErrors(newErrors);
    if (messages.length > 0) {
      setTimeout(() => {
        const errorElement = document.querySelector(
          `[name="${firstErrorRef.current}"]`
        );
        if (errorElement) errorElement.focus();
      }, 0);
      alert("❌ Xatoliklar:\n\n" + messages.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    firstErrorRef.current = null;

    if (!validateForm()) return;

    setIsLoading(true);

    const cleaned = {
      ...form,
      videoURL: form.videoURL.filter((url) => url.trim()),
      curriculum: form.curriculum
        .map((section) => ({
          title: section.title.trim(),
          week: section.week.trim(),
          videos: section.videos
            .filter((v) => v.title && v.duration && v.videoUrl)
            .map((v) => ({
              ...v,
              title: v.title.trim(),
              duration: v.duration.trim(),
              videoUrl: v.videoUrl.trim(),
              isFree: v.isFree || false,
            })),
        }))
        .filter((s) => s.title && s.week && s.videos.length > 0),
    };

    try {
      if (form.id) {
        const ref = doc(db, "courses", form.id);
        await updateDoc(ref, cleaned);
      } else {
        await addDoc(collection(db, "courses"), cleaned);
      }

      setIsLoading(false);
      onClose();
      setTimeout(() => {
        alert(form.id ? "✅ Kurs yangilandi!" : "✅ Kurs qo‘shildi!");
        window.location.reload();
      }, 100);
    } catch (err) {
      setIsLoading(false);
      alert("❌ Xatolik: " + err.message);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ❌
        </button>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <form className="course-form" onSubmit={handleSubmit}>
            <h2>📘 Kurs qo‘shish</h2>
            <div className="flex-group">
              <input
                name="title"
                className={errors.title ? "error" : ""}
                value={form.title}
                placeholder="Kurs nomi"
                onChange={handleChange}
              />
              <input
                name="instructor"
                className={errors.instructor ? "error" : ""}
                placeholder="O‘qituvchi"
                value={form.instructor}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="description"
              className={errors.description ? "error" : ""}
              placeholder="Ta'rif"
              value={form.description}
              onChange={handleChange}
            />
            <div className="flex-group">
              <input
                name="duration"
                className={errors.duration ? "error" : ""}
                placeholder="Davomiylik"
                value={form.duration}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                className={errors.price ? "error" : ""}
                placeholder="Narxi"
                value={form.price}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="flex-group">
              <select
                name="level"
                className={errors.level ? "error" : ""}
                value={form.level}
                onChange={handleChange}
              >
                <option value="">Daraja</option>
                <option value="Boshlang'ich">Boshlang‘ich</option>
                <option value="O'rta">O‘rta</option>
                <option value="Yuqori">Yuqori</option>
              </select>
              <select
                name="category"
                className={errors.category ? "error" : ""}
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Yo‘nalish</option>
                <option value="IT">IT</option>
                <option value="Design">Dizayn</option>
                <option value="Languages">Tillar</option>
                <option value="LifeSkills">Hayotiy ko‘nikmalar</option>
                <option value="Profession">Kasb-hunar</option>
                <option value="Marketing">Marketing</option>
                <option value="Development">Rivojlanish</option>
                <option value="Subjects">Fanlar</option>
              </select>
            </div>

            <div className="video-urls-section">
              <h4>Video URL-lar</h4>
              {form.videoURL.map((url, i) => (
                <input
                  key={i}
                  name={`videoURL-${i}`}
                  className={errors[`videoURL-${i}`] ? "error" : ""}
                  placeholder={`Video URL ${i + 1}`}
                  value={url}
                  onChange={(e) => {
                    const updated = [...form.videoURL];
                    updated[i] = e.target.value;
                    setForm({ ...form, videoURL: updated });
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, videoURL: [...form.videoURL, ""] })
                }
              >
                ➕ Video qo‘shish
              </button>
            </div>

            {form.curriculum.map((section, si) => (
              <div className="curriculum-section" key={si}>
                <h4>{si + 1}-bo‘lim</h4>
                <input
                  name={`section-title-${si}`}
                  className={errors[`section-title-${si}`] ? "error" : ""}
                  placeholder="Bo‘lim nomi"
                  value={section.title}
                  onChange={(e) =>
                    handleCurriculumChange(si, "title", e.target.value)
                  }
                />
                <input
                  name={`section-week-${si}`}
                  className={errors[`section-week-${si}`] ? "error" : ""}
                  placeholder="Hafta"
                  value={section.week}
                  onChange={(e) => {
                    const val = e.target.value;
                    // faqat raqamlar kiritilsin, bo'sh string ham bo'lsa ruxsat
                    if (val === "" || /^\d*$/.test(val)) {
                      handleCurriculumChange(si, "week", val);
                    }
                  }}
                />
                {section.videos.map((video, vi) => (
                  <div className="video-item" key={vi}>
                    <input
                      placeholder="Video nomi"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange(si, vi, "title", e.target.value)
                      }
                    />
                    <input
                      placeholder="Davomiyligi (daqiqa)"
                      value={(() => {
                        const minutes = parseInt(
                          form.curriculum[si].videos[vi].duration,
                          10
                        );
                        if (isNaN(minutes) || minutes < 60)
                          return form.curriculum[si].videos[vi].duration;
                        const h = Math.floor(minutes / 60);
                        const m = minutes % 60;
                        return `${h} soat${m > 0 ? ` ${m} daqiqa` : ""}`;
                      })()}
                      onChange={(e) => {
                        // Faqat son kiritilsin (faqat raqam va bo'sh satr)
                        const val = e.target.value;
                        // Kiruvchi qiymatni tozalab, faqat raqamlarni olish uchun:
                        const onlyNumbers = val.replace(/[^\d]/g, "");
                        handleVideoChange(si, vi, "duration", onlyNumbers);
                      }}
                    />

                    <input
                      placeholder="URL"
                      value={video.videoUrl}
                      onChange={(e) =>
                        handleVideoChange(si, vi, "videoUrl", e.target.value)
                      }
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={video.isFree}
                        onChange={(e) =>
                          handleVideoChange(si, vi, "isFree", e.target.checked)
                        }
                      />
                      Tekin
                    </label>
                  </div>
                ))}
                <button type="button" onClick={() => addVideoToSection(si)}>
                  ➕ Video
                </button>
              </div>
            ))}

            <button type="button" onClick={addCurriculumSection}>
              ➕ Bo‘lim qo‘shish
            </button>
            <button type="submit" className="btn-submit">
              📤 Saqlash
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseCardModal;
