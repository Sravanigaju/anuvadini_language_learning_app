import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import { FaMicrophone } from 'react-icons/fa';
import { useRef } from 'react';
import Footer2 from '../../components/Footer/Footer2';


function RegisterInstitution() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactInfo: '',
    institutionName: '',
    type: '',
    address: '',
    websiteUrl: '',
    registrationNumber: '',
    authorizedPerson: '',
    affiliations: '',
    docs: null,
    educationQualification: '',
    expertise: '',
    portfolio: '',
    languages: [''],
    yearsOfExperience: '',
    linkedInUrl: '',
    region: '',
    location: '',
    validatorBio: '',
    idProof: null,
    certificate: null,
    projectLinks: [''],
    bio: '',
  });
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionRef = useRef(null);

const startListening = (field) => {
  if (!SpeechRecognition) {
    alert("Your browser does not support voice input.");
    return;
  }

  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] ? prev[field] + ' ' + transcript : transcript,
    }));
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
  recognitionRef.current = recognition;
};


  const [role, setRole] = useState('institution');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleProjectLinkChange = (index, value) => {
    const updatedLinks = [...form.projectLinks];
    updatedLinks[index] = value;
    setForm((prev) => ({ ...prev, projectLinks: updatedLinks }));
  };

  const addProjectLink = () => {
    if (form.projectLinks.length < 5) {
      setForm((prev) => ({
        ...prev,
        projectLinks: [...prev.projectLinks, ''],
      }));
    }
  };

  const removeProjectLink = (index) => {
    const updatedLinks = form.projectLinks.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, projectLinks: updatedLinks }));
  };

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...form.languages];
    updatedLanguages[index] = value;
    setForm((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const addLanguage = () => {
    if (form.languages.length < 10) {
      setForm((prev) => ({
        ...prev,
        languages: [...prev.languages, ''],
      }));
    }
  };

  const removeLanguage = (index) => {
    const updatedLanguages = form.languages.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('formData', JSON.stringify({ ...form, role }));
    navigate('/verify-phone');
  };

  function renderFields(fields) {
    const half = Math.ceil(fields.length / 2);
    const firstHalf = fields.slice(0, half);
    const secondHalf = fields.slice(half);

    return (
      <>
        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
          {firstHalf.map(([label, name]) => (
            <div key={name} >
              <Form.Label style={styles.label}>{label}</Form.Label>
              <Form.Control
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                style={styles.inputHorizontal}
                required
              />
            </div>
          ))}
        </div>
        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
  <Form.Group>
    <Form.Label style={styles.label}>Phone Number</Form.Label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Form.Control
        type="tel"
        name="phone"
        value={form.phone || ''}
        onChange={handleChange}
        style={styles.inputHorizontal}
        required
      />
      <span onClick={() => startListening("phone")} style={styles.micIcon}>
        <FaMicrophone />
      </span>
    </div>
  </Form.Group>
</div>

<div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
  <Form.Group>
    <Form.Label style={styles.label}>OTP</Form.Label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Form.Control
        type="text"
        name="otp"
        value={form.otp || ''}
        onChange={handleChange}
        style={styles.inputHorizontal}
        required
      />
      <span onClick={() => startListening("otp")} style={styles.micIcon}>
        <FaMicrophone />
      </span>
    </div>
  </Form.Group>
</div>

        <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
          {secondHalf.map(([label, name]) => (
            <Form.Group key={name}>
              <Form.Label style={styles.label}>{label}</Form.Label>
              <Form.Control
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                style={styles.inputHorizontal}
                required
              />
            </Form.Group>
          ))}
        </div>
        </>
    );
  }

  return (
    <div>
      {/* <Header /> */}
      <div style={{ height: '3rem' }} /> {/* Added spacing after header */}
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h4>

            <Form.Group style={{ ...styles.formGroup, flexDirection: "row", justifyContent: 'center' }}>
              <Form.Label style={{ fontWeight: '600', marginRight: '1rem' }}>Register As:</Form.Label>
              <Form.Check inline type="radio" label="Creator" value="creator" checked={role === 'creator'} onChange={() => setRole('creator')} />
              <Form.Check inline type="radio" label="Validator" value="validator" checked={role === 'validator'} onChange={() => setRole('validator')} />
              <Form.Check inline type="radio" label="Institution" value="institution" checked={role === 'institution'} onChange={() => setRole('institution')} />
            </Form.Group>

            <Form onSubmit={handleSubmit}>
              <div className='row'>
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
          <span onClick={() => startListening(name)} style={styles.micIcon}>
            <FaMicrophone />
          </span>
        </div>
      </Form.Group>
    </div>
  ))}
</div>


              {role === 'institution' && (
  <>
    <div className='row'>
      {[
        ['Affiliations', 'affiliations'],
        ['Contact Info', 'contactInfo'],
        ['Website URL', 'websiteUrl'],
        ['Registration Number', 'registrationNumber'],
        ['Authorized Person', 'authorizedPerson'],
        ['Institution Name', 'institutionName'],
        ['Type', 'type']
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

    <Form.Group style={styles.formGroup}>
      <Form.Label style={styles.label}>Address</Form.Label>
      <div style={styles.inputWrapper}>
        <Form.Control
          as="textarea"
          rows={3}
          name="address"
          value={form.address}
          onChange={handleChange}
          style={{ ...styles.inputHorizontal, height: '5rem', resize: 'vertical', paddingRight: '2.5rem' }}
          placeholder="Enter full address here"
          required
        />
        <span onClick={() => startListening('address')} style={styles.micIcon}><FaMicrophone /></span>
      </div>
    </Form.Group>
  </>
)}

              </div>

              {role === 'creator' && (
  <>
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
              <span onClick={() => startListening(name)} style={styles.micIcon}>
                <FaMicrophone />
              </span>
            </div>
          </Form.Group>
        </div>
      ))}
    </div>

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
              <span onClick={() => startListening(name)} style={styles.micIcon}>
                <FaMicrophone />
              </span>
            </div>
          </Form.Group>
        </div>
      ))}
    </div>

    <div className="row">
      <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
        <Form.Group>
          <Form.Label style={styles.label}>LinkedIn URL</Form.Label>
          <div style={styles.inputWrapper}>
            <Form.Control
              type="text"
              name="linkedInUrl"
              value={form.linkedInUrl}
              onChange={handleChange}
              style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
              required
            />
            <span onClick={() => startListening("linkedInUrl")} style={styles.micIcon}>
              <FaMicrophone />
            </span>
          </div>
        </Form.Group>
      </div>
    </div>
  </>
)}

             {role === 'validator' && (
  <>
    <div className="row">
      {[
        ['Years of Experience', 'yearsOfExperience'],
        ['Education Qualification', 'educationQualification']
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
              <span onClick={() => startListening(name)} style={styles.micIcon}>
                <FaMicrophone />
              </span>
            </div>
          </Form.Group>
        </div>
      ))}
    </div>

    <div className="row">
      {[
        ['Region', 'region'],
        ['Location', 'location']
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
              <span onClick={() => startListening(name)} style={styles.micIcon}>
                <FaMicrophone />
              </span>
            </div>
          </Form.Group>
        </div>
      ))}
    </div>
  </>
)}



              {(role === 'creator' || role === 'validator') && (
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Languages</Form.Label>
                  <div className='row'>
                    {form.languages.map((lang, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Form.Control
                          type="text"
                          placeholder={`Language ${i + 1}`}
                          value={lang}
                          onChange={(e) => handleLanguageChange(i, e.target.value)}
                          style={{ ...styles.inputHorizontal, flex: 1 }}
                        />
                        {form.languages.length > 1 && (
                          <Button variant="danger" onClick={() => removeLanguage(i)} style={styles.removeBtn}>✕</Button>
                        )}
                      </div>
                    ))}
                    {form.languages.length < 10 && (
                      <Button variant="outline-primary" onClick={addLanguage} style={styles.addBtn}>+ Add Language</Button>
                    )}
                  </div>
                </Form.Group>
              )}

              {role === 'validator' && (
                <>

                  
                 <Form.Group style={{ ...styles.formGroup, width: '100%' }}>
  <Form.Label style={styles.label}>Bio</Form.Label>
  <div style={styles.inputWrapper}>
    <Form.Control
      as="textarea"
      rows={3}
      name="validatorBio"
      value={form.validatorBio}
      onChange={handleChange}
      style={{
        ...styles.inputHorizontal,
        minHeight: 100,
        resize: 'none',
        paddingRight: '2.5rem',
        width: '100%'  // Expands horizontally
      }}
      placeholder="Tell us something about yourself..."
      required
    />
    <span onClick={() => startListening("validatorBio")} style={styles.micIcon}>
      <FaMicrophone />
    </span>
  </div>
</Form.Group>


                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>ID Proof</Form.Label>
                    <Form.Control type="file" name="idProof" onChange={handleChange} style={styles.inputHorizontal} required />
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>Certificate</Form.Label>
                    <Form.Control type="file" name="certificate" onChange={handleChange} style={styles.inputHorizontal} required />
                  </Form.Group>
                </>
              )}

              {(role === 'creator' || role === 'validator') && (
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Project Links</Form.Label>
                  <div style={{ flex: 1 }}>
                    {form.projectLinks.map((link, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Form.Control type="text" placeholder={`Project Link ${i + 1}`} value={link} onChange={(e) => handleProjectLinkChange(i, e.target.value)} style={{ ...styles.inputHorizontal, flex: 1 }} />
                        {form.projectLinks.length > 1 && (
                          <Button variant="danger" onClick={() => removeProjectLink(i)} style={styles.removeBtn}>✕</Button>
                        )}
                      </div>
                    ))}
                    {form.projectLinks.length < 5 && (
                      <Button variant="outline-primary" onClick={addProjectLink} style={styles.addBtn}>+ Add Link</Button>
                    )}
                  </div>
                </Form.Group>
              )}

              {role === 'creator' && (
 <Form.Group style={{ ...styles.formGroup, width: '100%' }}>
  <Form.Label style={styles.label}>Bio</Form.Label>
  <div style={styles.inputWrapper}>
    <Form.Control
      as="textarea"
      rows={3}
      name="bio"
      value={form.bio}
      onChange={handleChange}
      style={{
        ...styles.inputHorizontal,
        minHeight: 100,
        resize: 'none',
        paddingRight: '2.5rem',
        width: '100%' // <-- key change
      }}
      placeholder="Tell us something about yourself..."
      required
    />
    <span onClick={() => startListening("bio")} style={styles.micIcon}>
      <FaMicrophone />
    </span>
  </div>
</Form.Group>

)}

              <div className='row'>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>       
                  <Form.Group>
                  <Form.Label style={styles.label}>Password</Form.Label>
                  <div style={{ ...styles.inputWrapper,}}>
                    <Form.Control type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }} required />
                    <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                </Form.Group>
                </div>

                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6'>
                  <Form.Group>
                    <Form.Label style={styles.label}>Confirm Password</Form.Label>
                    <div style={{ ...styles.inputWrapper, }}>
                      <Form.Control type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }} required />
                      <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                  </Form.Group>
                </div>
              </div>

              {role === 'institution' && (
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Documents</Form.Label>
                  <Form.Control type="file" name="docs" onChange={handleChange} style={styles.inputHorizontal} />
                </Form.Group>
              )}

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
  formGroup: { display: 'flex', flexDirection: "column", alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  label: { width: '100%', marginTop: 10, fontWeight: 500, color: '#333' },
  inputHorizontal: {
  width: '100%', // Add this line
  border: '1px solid rgb(220, 166, 57)',
  borderRadius: '0.5rem',
  height: '2.75rem',
  fontSize: '1rem',
  padding: '0 1rem',
},

  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  eyeIcon: { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' },
  submitButton: { backgroundColor: 'rgb(53, 168, 84)', color: '#fff', fontWeight: 600, padding: '0.6rem 2rem', fontSize: '1rem', border: 'none', borderRadius: '0.5rem',marginTop:10 },
  addBtn: { padding: '0.25rem 0.75rem', fontSize: '0.9rem', fontWeight: 500, borderRadius: '0.5rem', marginTop: '0.25rem' },
  removeBtn: { padding: '0 0.6rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '0.5rem', height: '2.75rem' },
  splitRow: { display: 'flex', gap: '2rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' },
  column: { flexDirection: "row", justifyContent: "space-between", width: "48%" },
  micIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#007bff',
    fontSize: '1.2rem'
  }

};

export default RegisterInstitution;
