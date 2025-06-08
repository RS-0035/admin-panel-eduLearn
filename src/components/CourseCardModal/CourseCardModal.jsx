import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import "./CourseCardModal.css";

const CourseCardModal = ({ showModal, onClose, existingData }) => {
  const [form, setForm] = useState(
    existingData || {
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
          videos: [{ title: "", duration: "", videoUrl: "", isFree: true }],
        },
      ],
    }
  );

  useEffect(() => {
    if (existingData) {
      setForm(existingData);
    }
  }, [existingData]);

  if (!showModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  const handleCurriculumChange = (index, field, value) => {
    const updatedCurriculum = [...form.curriculum];
    updatedCurriculum[index][field] = value;
    setForm({ ...form, curriculum: updatedCurriculum });
  };

  const handleVideoChange = (sectionIndex, videoIndex, field, value) => {
    const updatedCurriculum = [...form.curriculum];
    updatedCurriculum[sectionIndex].videos[videoIndex][field] =
      field === "isFree" ? value : value;
    setForm({ ...form, curriculum: updatedCurriculum });
  };

  const addCurriculumSection = () => {
    setForm({
      ...form,
      curriculum: [
        ...form.curriculum,
        {
          title: "",
          week: "",
          videos: [{ title: "", duration: "", videoUrl: "" }],
        },
      ],
    });
  };

  const addVideoToSection = (sectionIndex) => {
    const updatedCurriculum = [...form.curriculum];
    updatedCurriculum[sectionIndex].videos.push({
      title: "",
      duration: "",
      videoUrl: "",
    });
    setForm({ ...form, curriculum: updatedCurriculum });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedCurriculum = form.curriculum
      .map((section) => ({
        title: section.title.trim(),
        week: section.week.trim(),
        videos: section.videos
          .filter((video) => video.title && video.duration && video.videoUrl)
          .map((video) => ({
            title: video.title.trim(),
            duration: video.duration.trim(),
            videoUrl: video.videoUrl.trim(),
            isFree: video.isFree ?? false,
          })),
      }))
      .filter(
        (section) => section.title && section.week && section.videos.length > 0
      );

    const cleanedVideoURL = form.videoURL.filter((url) => url.trim() !== "");

    const courseData = {
      ...form,
      videoURL: cleanedVideoURL,
      curriculum: cleanedCurriculum,
      category: form.category,
    };

    try {
      if (form.id) {
        // Tahrirlash
        const docRef = doc(db, "courses", form.id);
        await updateDoc(docRef, courseData);
        alert("✅ Kurs yangilandi!");
      } else {
        // Yangi qo‘shish
        await addDoc(collection(db, "courses"), courseData);
        alert("✅ Kurs qo‘shildi!");
      }
      onClose(); // modalni yopish
    } catch (err) {
      alert("❌ Xatolik: " + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ❌
        </button>
        <form className="course-form" onSubmit={handleSubmit}>
          <h2>📘 Yangi kurs qo‘shish</h2>
          <div className="flex-group">
            <input
              name="title"
              placeholder="Kurs nomi"
              onChange={handleChange}
            />
            <input
              name="instructor"
              placeholder="O‘qituvchi"
              onChange={handleChange}
              value={form.instructor}
            />
          </div>
          <textarea
            name="description"
            placeholder="Ta'rif"
            value={form.description}
            onChange={handleChange}
          />
          <div className="flex-group">
            <input
              name="duration"
              value={form.duration}
              placeholder="Davomiylik"
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Narxi"
              onChange={handleChange}
              value={form.price}
              min="0"
            />
          </div>
          <div className="flex-group">
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="">Daraja</option>
              <option value="Boshlang'ich">Boshlang‘ich</option>
              <option value="O'rta">O‘rta</option>
              <option value="Yuqori">Yuqori</option>
            </select>
            <select
              name="category"
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
            {form.videoURL.map((url, index) => (
              <input
                key={index}
                placeholder={`Video URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                  const newVideoURL = [...form.videoURL];
                  newVideoURL[index] = e.target.value;
                  setForm({ ...form, videoURL: newVideoURL });
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

          {form.curriculum.map((section, sIndex) => (
            <div className="curriculum-section" key={sIndex}>
              <h4>{sIndex + 1}-bo‘lim</h4>
              <input
                placeholder="Bo‘lim nomi"
                value={section.title}
                onChange={(e) =>
                  handleCurriculumChange(sIndex, "title", e.target.value)
                }
              />
              <input
                placeholder="Hafta"
                value={section.week}
                onChange={(e) =>
                  handleCurriculumChange(sIndex, "week", e.target.value)
                }
              />
              {section.videos.map((video, vIndex) => (
                <div key={vIndex} className="video-item">
                  <input
                    placeholder="Video nomi"
                    value={video.title}
                    onChange={(e) =>
                      handleVideoChange(sIndex, vIndex, "title", e.target.value)
                    }
                  />
                  <input
                    placeholder="Davomiyligi"
                    value={video.duration}
                    onChange={(e) =>
                      handleVideoChange(
                        sIndex,
                        vIndex,
                        "duration",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="URL"
                    value={video.videoUrl}
                    onChange={(e) =>
                      handleVideoChange(
                        sIndex,
                        vIndex,
                        "videoUrl",
                        e.target.value
                      )
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={video.isFree}
                      onChange={(e) =>
                        handleVideoChange(
                          sIndex,
                          vIndex,
                          "isFree",
                          e.target.checked
                        )
                      }
                    />
                    Tekin
                  </label>
                </div>
              ))}
              <button type="button" onClick={() => addVideoToSection(sIndex)}>
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
      </div>
    </div>
  );
};

export default CourseCardModal;
