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
    instructor: "",
    videoURL: [],
    curriculum: [
      {
        title: "",
        week: "",
        videos: [{ title: "", duration: "", videoUrl: "" }],
      },
    ],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurriculumChange = (index, field, value) => {
    const updatedCurriculum = [...form.curriculum];
    updatedCurriculum[index][field] = value;
    setForm({ ...form, curriculum: updatedCurriculum });
  };

  const handleVideoChange = (sectionIndex, videoIndex, field, value) => {
    const updatedCurriculum = [...form.curriculum];
    updatedCurriculum[sectionIndex].videos[videoIndex][field] = value;
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
          })),
      }))
      .filter(
        (section) => section.title && section.week && section.videos.length > 0
      );

    const courseData = {
      ...form,
      curriculum: cleanedCurriculum,
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
        onChange={handleChange}
      />
      <input name="duration" placeholder="Davomiylik" onChange={handleChange} />
      <input name="level" placeholder="Daraja" onChange={handleChange} />
      <input
        name="instructor"
        placeholder="O'qituvchi"
        onChange={handleChange}
      />

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
