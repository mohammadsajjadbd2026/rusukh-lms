import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Admin sub-components
const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', thumbnail: '', price: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('/courses');
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/admin/courses/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('/admin/courses', form);
    }
    setForm({ title: '', description: '', thumbnail: '', price: 0 });
    fetchCourses();
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditingId(course._id);
  };

  const handleDelete = async (id) => {
    if (confirm('কোর্স মুছতে চান?')) {
      await axios.delete(`/admin/courses/${id}`);
      fetchCourses();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">কোর্স ম্যানেজমেন্ট</h2>
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded">
        <input type="text" placeholder="শিরোনাম" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
        <textarea placeholder="বিবরণ" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
        <input type="text" placeholder="থাম্বনেইল URL" value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} className="w-full p-2 mb-2 border rounded" />
        <input type="number" placeholder="মূল্য" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-2 mb-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? 'আপডেট' : 'যোগ করুন'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', thumbnail: '', price: 0 }); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">বাতিল</button>}
      </form>
      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c._id} className="p-4 border rounded flex justify-between items-center">
            <div><h3 className="font-bold">{c.title}</h3><p className="text-sm">{c.description.substring(0, 80)}</p></div>
            <div><button onClick={() => handleEdit(c)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">এডিট</button><button onClick={() => handleDelete(c._id)} className="bg-red-500 text-white px-3 py-1 rounded">ডিলিট</button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ManageLessons = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ title: '', videoUrl: '', sheetLink: '', order: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/courses/${selectedCourse}`).then(res => setLessons(res.data.lessons));
    }
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, courseId: selectedCourse };
    if (editingId) {
      await axios.put(`/admin/lessons/${editingId}`, payload);
    } else {
      await axios.post('/admin/lessons', payload);
    }
    setForm({ title: '', videoUrl: '', sheetLink: '', order: 0 });
    setEditingId(null);
    const res = await axios.get(`/courses/${selectedCourse}`);
    setLessons(res.data.lessons);
  };

  const handleDelete = async (id) => {
    if (confirm('লেসন মুছতে চান?')) {
      await axios.delete(`/admin/lessons/${id}`);
      const res = await axios.get(`/courses/${selectedCourse}`);
      setLessons(res.data.lessons);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">লেসন ম্যানেজমেন্ট</h2>
      <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-2 mb-4 border rounded">
        <option value="">কোর্স সিলেক্ট করুন</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      {selectedCourse && (
        <>
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded">
            <input type="text" placeholder="লেসন শিরোনাম" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
            <input type="text" placeholder="YouTube এম্বেড URL" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
            <input type="text" placeholder="শীট লিংক (Google Drive/PDF)" value={form.sheetLink} onChange={e => setForm({...form, sheetLink: e.target.value})} className="w-full p-2 mb-2 border rounded" />
            <input type="number" placeholder="অর্ডার" value={form.order} onChange={e => setForm({...form, order: e.target.value})} className="w-full p-2 mb-2 border rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? 'আপডেট' : 'যোগ করুন'}</button>
          </form>
          <div className="grid gap-2">
            {lessons.map(l => (
              <div key={l._id} className="p-2 border rounded flex justify-between"><span>{l.order}. {l.title}</span><div><button onClick={() => { setForm(l); setEditingId(l._id); }} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">এডিট</button><button onClick={() => handleDelete(l._id)} className="bg-red-500 text-white px-2 py-1 rounded">ডিলিট</button></div></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ManageQuizzes = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'quiz', questions: [] });
  const [editingId, setEditingId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ questionText: '', options: ['', '', '', ''], correctAnswer: '' });

  useEffect(() => {
    axios.get('/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/courses/${selectedCourse}`).then(res => setQuizzes(res.data.quizzes));
    }
  }, [selectedCourse]);

  const addQuestion = () => {
    if (!newQuestion.questionText || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) {
      alert('সব প্রশ্নের তথ্য পূরণ করুন');
      return;
    }
    setForm({ ...form, questions: [...form.questions, newQuestion] });
    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, courseId: selectedCourse };
    if (editingId) {
      await axios.put(`/admin/quizzes/${editingId}`, payload);
    } else {
      await axios.post('/admin/quizzes', payload);
    }
    setForm({ title: '', type: 'quiz', questions: [] });
    setEditingId(null);
    const res = await axios.get(`/courses/${selectedCourse}`);
    setQuizzes(res.data.quizzes);
  };

  const handleDelete = async (id) => {
    if (confirm('কুইজ মুছতে চান?')) {
      await axios.delete(`/admin/quizzes/${id}`);
      const res = await axios.get(`/courses/${selectedCourse}`);
      setQuizzes(res.data.quizzes);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">কুইজ ও পরীক্ষা ম্যানেজমেন্ট</h2>
      <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-2 mb-4 border rounded">
        <option value="">কোর্স সিলেক্ট করুন</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      {selectedCourse && (
        <>
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded">
            <input type="text" placeholder="কুইজ/পরীক্ষার শিরোনাম" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-2 mb-2 border rounded" required />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-2 mb-2 border rounded">
              <option value="quiz">কুইজ</option>
              <option value="exam">পরীক্ষা</option>
            </select>
            <div className="mb-4 p-3 border rounded">
              <h4 className="font-semibold">প্রশ্ন যোগ করুন</h4>
              <input type="text" placeholder="প্রশ্ন" value={newQuestion.questionText} onChange={e => setNewQuestion({...newQuestion, questionText: e.target.value})} className="w-full p-2 mb-2 border rounded" />
              {newQuestion.options.map((opt, idx) => (
                <input key={idx} type="text" placeholder={`অপশন ${idx+1}`} value={opt} onChange={e => { const opts = [...newQuestion.options]; opts[idx] = e.target.value; setNewQuestion({...newQuestion, options: opts}); }} className="w-full p-1 mb-1 border rounded" />
              ))}
              <input type="text" placeholder="সঠিক উত্তর (অপশনের টেক্সট)" value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} className="w-full p-2 mb-2 border rounded" />
              <button type="button" onClick={addQuestion} className="bg-blue-500 text-white px-3 py-1 rounded">প্রশ্ন যোগ করুন</button>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold">প্রশ্নের তালিকা:</h4>
              {form.questions.map((q, idx) => <div key={idx} className="text-sm p-1 border-b">{idx+1}. {q.questionText}</div>)}
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editingId ? 'আপডেট' : 'সেভ করুন'}</button>
          </form>
          <div className="grid gap-2">
            {quizzes.map(q => (
              <div key={q._id} className="p-2 border rounded flex justify-between"><span>{q.title} ({q.type}) - {q.questions.length} প্রশ্ন</span><div><button onClick={() => { setForm({ title: q.title, type: q.type, questions: q.questions }); setEditingId(q._id); }} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">এডিট</button><button onClick={() => handleDelete(q._id)} className="bg-red-500 text-white px-2 py-1 rounded">ডিলিট</button></div></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ManageEnrollments = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const usersRes = await axios.get('/admin/users');
    const coursesRes = await axios.get('/courses');
    setUsers(usersRes.data);
    setCourses(coursesRes.data);
  };

  const handleEnroll = async () => {
    if (!selectedUser || !selectedCourse) return alert('ইউজার ও কোর্স সিলেক্ট করুন');
    await axios.post(`/admin/enroll/${selectedUser}/${selectedCourse}`);
    alert('এনরোল সম্পন্ন');
    fetchData();
  };

  const handleUnenroll = async (userId, courseId) => {
    await axios.delete(`/admin/unenroll/${userId}/${courseId}`);
    fetchData();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">এনরোলমেন্ট কন্ট্রোল</h2>
      <div className="flex gap-4 mb-6">
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="p-2 border rounded flex-1">
          <option value="">ইউজার সিলেক্ট করুন</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
        </select>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="p-2 border rounded flex-1">
          <option value="">কোর্স সিলেক্ট করুন</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
        <button onClick={handleEnroll} className="bg-green-600 text-white px-4 py-2 rounded">এনরোল করুন</button>
      </div>
      <h3 className="text-xl font-semibold mb-2">বর্তমান এনরোলমেন্ট</h3>
      {users.map(user => (
        <div key={user._id} className="mb-4 p-3 border rounded">
          <p className="font-bold">{user.name} ({user.email})</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.enrolledCourses?.map(course => (
              <span key={course._id} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">{course.title} <button onClick={() => handleUnenroll(user._id, course._id)} className="text-red-600 text-sm">x</button></span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SiteSettings = () => {
  const [fontFamily, setFontFamily] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/settings/public').then(res => setFontFamily(res.data.fontFamily));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.put('/settings', { fontFamily });
    alert('সেটিংস আপডেট হয়েছে');
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">সাইট সেটিংস</h2>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
        <label className="block mb-2">ফন্ট ফ্যামিলি (CSS font-family value)</label>
        <input type="text" value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full p-2 mb-4 border rounded" />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</button>
      </form>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">অ্যাডমিন প্যানেল</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <Link to="/admin/courses" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">কোর্স</Link>
        <Link to="/admin/lessons" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">লেসন</Link>
        <Link to="/admin/quizzes" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">কুইজ</Link>
        <Link to="/admin/enrollments" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">এনরোলমেন্ট</Link>
        <Link to="/admin/settings" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">সেটিংস</Link>
      </div>
      <Routes>
        <Route path="courses" element={<ManageCourses />} />
        <Route path="lessons" element={<ManageLessons />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
        <Route path="enrollments" element={<ManageEnrollments />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="*" element={<ManageCourses />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
