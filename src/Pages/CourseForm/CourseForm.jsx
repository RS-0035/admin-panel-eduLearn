import React, { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import "./CourseForm.css";

const CourseForm = () => {
  const [form, setForm] = useState({
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
  });

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
      await addDoc(collection(db, "courses"), courseData);
      alert("✅ Kurs muvaffaqiyatli qo‘shildi!");
    } catch (err) {
      alert("❌ Xatolik: " + err.message);
    }
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <h2>Yangi kurs qo‘shish</h2>
      <input name="title" placeholder="Kurs nomi" onChange={handleChange} />
      <textarea
        name="description"
        placeholder="Ta'rif"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="duration"
        value={form.duration}
        placeholder="Davomiylik"
        onChange={handleChange}
      />
      <select name="level" value={form.level} onChange={handleChange}>
        <option value="">Darajani tanlang</option>
        <option value="Boshlang'ich">Boshlang‘ich</option>
        <option value="O'rta">O‘rta</option>
        <option value="Yuqori">Yuqori</option>
      </select>
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Yo‘nalishni tanlang</option>
        <option value="IT">🔧 Texnologiya va IT</option>
        <option value="Design">🎨 Dizayn</option>
        <option value="Languages">🌍 Tillar</option>
        <option value="LifeSkills">🍳 Hayotiy ko‘nikmalar</option>
        <option value="Profession">💼 Kasb-hunar</option>
        <option value="Marketing">📈 Biznes va Marketing</option>
        <option value="Development">💡 Shaxsiy rivojlanish</option>
        <option value="Subjects">
          📖 Fanlar (Maktab va oliy o‘quv yurtlari uchun)
        </option>
      </select>
      <input
        name="instructor"
        placeholder="O'qituvchi"
        onChange={handleChange}
        value={form.instructor}
      />
      <input
        type="number"
        name="price"
        placeholder="Kurs narxi (so'mda)"
        onChange={handleChange}
        value={form.price}
        required
        min="0"
        step="any"
      />
      {/* Video URL-lar uchun bo‘lim */}
      <div className="video-urls-section">
        <h3>Video URL-lar</h3>
        {form.videoURL.map((url, index) => (
          <input
            key={index}
            type="text"
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
          onClick={() => setForm({ ...form, videoURL: [...form.videoURL, ""] })}
        >
          ➕ Video URL qo‘shish
        </button>
      </div>
      {form.curriculum.map((section, sIndex) => (
        <div className="curriculum-section" key={sIndex}>
          <h3>{sIndex + 1}-Bo‘lim</h3>
          <input
            placeholder="Bo‘lim nomi"
            value={section.title}
            onChange={(e) =>
              handleCurriculumChange(sIndex, "title", e.target.value)
            }
          />
          <input
            placeholder="Hafta raqami"
            value={section.week}
            onChange={(e) =>
              handleCurriculumChange(sIndex, "week", e.target.value)
            }
          />

          {section.videos.map((video, vIndex) => (
            <div className="video-item" key={vIndex}>
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
                  handleVideoChange(sIndex, vIndex, "duration", e.target.value)
                }
              />
              <input
                placeholder="Video URL"
                value={video.videoUrl}
                onChange={(e) =>
                  handleVideoChange(sIndex, vIndex, "videoUrl", e.target.value)
                }
              />
              <label className="checkbox-container">
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
                <span className="checkmark"></span>
                Tekin video
              </label>
            </div>
          ))}

          <button
            className="btn-small"
            type="button"
            onClick={() => addVideoToSection(sIndex)}
          >
            ➕ Video qo‘shish
          </button>
        </div>
      ))}
      <button className="btn" type="button" onClick={addCurriculumSection}>
        ➕ Bo‘lim qo‘shish
      </button>
      <button className="btn-submit" type="submit">
        📤 Kursni yuklash
      </button>
    </form>
  );
};

export default CourseForm;
