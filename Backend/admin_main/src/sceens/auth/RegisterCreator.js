import React, { useState, useRef } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaMicrophone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer2 from '../../components/Footer/Footer2';

function RegisterCreator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationQualification: '',
    yearsOfExperience: '',
    expertise: '',
    portfolio: '',
    languages: [''],
    projectLinks: [''],
    lessons: [{ title: '', description: '' }],
    assessments: [{ title: '', details: '' }]
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  const startListening = (field) => {
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setForm(prev => {
        if (field.includes('.')) {
          const [parent, idx, key] = field.split('.');
          const i = parseInt(idx, 10);
          const updated = prev[parent].map((item, j) => j === i ? { ...item, [key]: item[key] ? item[key] + ' ' + transcript : transcript } : item);
          return { ...prev, [parent]: updated };
        }
        return { ...prev, [field]: prev[field] ? prev[field] + ' ' + transcript : transcript };
      });
    };
    recognition.onerror = (e) => console.error('Speech recognition error:', e.error);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm(prev => ({ ...prev, [field]: updated }));
  };
  const addArrayItem = (field, template) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], template] }));
  };
  const removeArrayItem = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('creatorData', JSON.stringify(form));
    navigate('/verify-phone');
  };

  return (
    <div>
      <Header />
      <div style={{ height: '3rem' }} />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>Register as Creator</h4>
            <Form onSubmit={handleSubmit}>
              {/* Basic info */}
              <div className="row">
                {[
                  ['Name', 'name'],
                  ['Email', 'email']
                ].map(([label, name]) => (
                  <div key={name} className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                    <Form.Group>
                      <Form.Label style={styles.label}>{label}</Form.Label>
                      <div style={styles.inputWrapper}>
                        <Form.Control
                          type="text"
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                          required
                        />
                        <span onClick={() => startListening(name)} style={styles.micIcon}><FaMicrophone /></span>
                      </div>
                    </Form.Group>
                  </div>
                ))}
              </div>

              {/* Education & Experience */}
              <div className="row">
                {[
                  ['Education Qualification', 'educationQualification'],
                  ['Years of Experience', 'yearsOfExperience']
                ].map(([label, name]) => (
                  <div key={name} className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                    <Form.Group>
                      <Form.Label style={styles.label}>{label}</Form.Label>
                      <div style={styles.inputWrapper}>
                        <Form.Control
                          type="text"
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                          required
                        />
                        <span onClick={() => startListening(name)} style={styles.micIcon}><FaMicrophone /></span>
                      </div>
                    </Form.Group>
                  </div>
                ))}
              </div>

              {/* Expertise & Portfolio */}
              <div className="row">
                {[
                  ['Expertise', 'expertise'],
                  ['Portfolio', 'portfolio']
                ].map(([label, name]) => (
                  <div key={name} className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                    <Form.Group>
                      <Form.Label style={styles.label}>{label}</Form.Label>
                      <div style={styles.inputWrapper}>
                        <Form.Control
                          type="text"
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                          required
                        />
                        <span onClick={() => startListening(name)} style={styles.micIcon}><FaMicrophone /></span>
                      </div>
                    </Form.Group>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Languages</Form.Label>
                <div className='row'>
                  {form.languages.map((lang, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Form.Control
                        type="text"
                        placeholder={`Language ${i + 1}`}
                        value={lang}
                        onChange={e => handleArrayChange('languages', i, null, e.target.value)}
                        style={{ ...styles.inputHorizontal, flex: 1 }}
                      />
                      {form.languages.length > 1 && (
                        <Button variant="danger" onClick={() => removeArrayItem('languages', i)} style={styles.removeBtn}>✕</Button>
                      )}
                    </div>
                  ))}
                  {form.languages.length < 10 && (
                    <Button variant="outline-primary" onClick={() => addArrayItem('languages', '')} style={styles.addBtn}>+ Add Language</Button>
                  )}
                </div>
              </Form.Group>

              {/* Project Links */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Project Links</Form.Label>
                <div style={{ flex: 1 }}>
                  {form.projectLinks.map((link, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Form.Control
                        type="text"
                        placeholder={`Project Link ${i + 1}`}
                        value={link}
                        onChange={e => handleArrayChange('projectLinks', i, null, e.target.value)}
                        style={{ ...styles.inputHorizontal, flex: 1 }}
                      />
                      {form.projectLinks.length > 1 && (
                        <Button variant="danger" onClick={() => removeArrayItem('projectLinks', i)} style={styles.removeBtn}>✕</Button>
                      )}
                    </div>
                  ))}
                  {form.projectLinks.length < 5 && (
                    <Button variant="outline-primary" onClick={() => addArrayItem('projectLinks', '')} style={styles.addBtn}>+ Add Link</Button>
                  )}
                </div>
              </Form.Group>

              {/* Lessons */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Lessons</Form.Label>
                {form.lessons.map((lesson, i) => (
                  <div key={i} style={{ width: '100%', marginBottom: '1rem' }}>
                    <div style={styles.inputWrapper}>
                      <Form.Control
                        type="text"
                        placeholder={`Lesson ${i + 1} Title`}
                        value={lesson.title}
                        onChange={e => handleArrayChange('lessons', i, 'title', e.target.value)}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                        required
                      />
                      <span onClick={() => startListening(`lessons.${i}.title`)} style={styles.micIcon}><FaMicrophone /></span>
                    </div>
                    <div style={{ ...styles.inputWrapper, marginTop: '0.5rem' }}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Description"
                        value={lesson.description}
                        onChange={e => handleArrayChange('lessons', i, 'description', e.target.value)}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem', height: '4rem', resize: 'vertical' }}
                        required
                      />
                      <span onClick={() => startListening(`lessons.${i}.description`)} style={styles.micIcon}><FaMicrophone /></span>
                    </div>
                    {form.lessons.length > 1 && (<Button variant="danger" onClick={() => removeArrayItem('lessons', i)} style={styles.removeBtn}>✕</Button>)}
                  </div>
                ))}
                <Button variant="outline-primary" onClick={() => addArrayItem('lessons', { title: '', description: '' })} style={styles.addBtn}>+ Add Lesson</Button>
              </Form.Group>

              {/* Assessments */}
              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Assessments</Form.Label>
                {form.assessments.map((assess, i) => (
                  <div key={i} style={{ width: '100%', marginBottom: '1rem' }}>
                    <div style={styles.inputWrapper}>
                      <Form.Control
                        type="text"
                        placeholder={`Assessment ${i + 1} Title`}
                        value={assess.title}
                        onChange={e => handleArrayChange('assessments', i, 'title', e.target.value)}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                        required
                      />
                      <span onClick={() => startListening(`assessments.${i}.title`)} style={styles.micIcon}><FaMicrophone /></span>
                    </div>
                    <div style={{ ...styles.inputWrapper, marginTop: '0.5rem' }}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Details/Intructions"
                        value={assess.details}
                        onChange={e => handleArrayChange('assessments', i, 'details', e.target.value)}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem', height: '4rem', resize: 'vertical' }}
                        required
                      />
                      <span onClick={() => startListening(`assessments.${i}.details`)} style={styles.micIcon}><FaMicrophone /></span>
                    </div>
                    {form.assessments.length > 1 && (<Button variant="danger" onClick={() => removeArrayItem('assessments', i)} style={styles.removeBtn}>✕</Button>)}
                  </div>
                ))}
                <Button variant="outline-primary" onClick={() => addArrayItem('assessments', { title: '', details: '' })} style={styles.addBtn}>+ Add Assessment</Button>
              </Form.Group>

              {/* Passwords */}
              <div className='row'>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                  <Form.Group>
                    <Form.Label style={styles.label}>Password</Form.Label>
                    <div style={styles.inputWrapper}>
                      <Form.Control type={form.showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }} required />
                      <span onClick={() => setForm(prev => ({ ...prev, showPassword: !prev.showPassword }))} style={styles.eyeIcon}>{form.showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </Form.Group>
                </div>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                  <Form.Group>
                    <Form.Label style={styles.label}>Confirm Password</Form.Label>
                    <div style={styles.inputWrapper}>
                      <Form.Control type={form.showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }} required />
                      <span onClick={() => setForm(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))} style={styles.eyeIcon}>{form.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" style={styles.submitButton}>Register</Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
      <Footer2 />
    </div>
  );
}

const styles = {
  wrapper: { backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', maxWidth: '50rem', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)', backgroundColor: '#fff' },
  heading: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#333' },
  formGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  label: { width: '100%', marginTop: 10, fontWeight: 500, color: '#333' },
  inputHorizontal: { width: '100%', border: '1px solid rgb(220, 166, 57)', borderRadius: '0.5rem', height: '2.75rem', fontSize: '1rem', padding: '0 1rem' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  eyeIcon: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' },
  micIcon: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#007bff', fontSize: '1.2rem' },
  submitButton: { backgroundColor: 'rgb(53, 168, 84)', color: '#fff', fontWeight: 600, padding: '0.6rem 2rem', fontSize: '1rem', border: 'none', borderRadius: '0.5rem', marginTop: 10 },
  addBtn: { padding: '0.25rem 0.75rem', fontSize: '0.9rem', fontWeight: 500, borderRadius: '0.5rem', marginTop: '0.25rem' },
  removeBtn: { padding: '0 0.6rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '0.5rem', height: '2.75rem' }
};

export default RegisterCreator; 