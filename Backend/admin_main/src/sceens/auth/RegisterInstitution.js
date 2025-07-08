import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../../components/header/Header';

function RegisterInstitution() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
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
    languages: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', { ...form, role });
  };

  return (
    <div>
      <Header />
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <Card style={styles.card}>
            <h4 style={styles.heading}>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h4>

            <Form.Group style={{ ...styles.formGroup, justifyContent: 'center' }}>
              <Form.Label style={{ fontWeight: '600', marginRight: '1rem' }}>Register As:</Form.Label>
              <Form.Check inline type="radio" label="Creator" name="role" value="creator" checked={role === 'creator'} onChange={() => setRole('creator')} />
              <Form.Check inline type="radio" label="Validator" name="role" value="validator" checked={role === 'validator'} onChange={() => setRole('validator')} />
              <Form.Check inline type="radio" label="Institution" name="role" value="institution" checked={role === 'institution'} onChange={() => setRole('institution')} />
            </Form.Group>

            <Form onSubmit={handleSubmit}>
              {renderFields([
                ['Name', 'name'],
                ['Email', 'email'],
              ])}

              {role === 'institution' && renderFields([
                ['Institution Name', 'institutionName'],
                ['Type', 'type'],
                ['Address', 'address'],
                ['Website URL', 'websiteUrl'],
                ['Registration Number', 'registrationNumber'],
                ['Authorized Person', 'authorizedPerson'],
                ['Affiliations', 'affiliations'],
                ['Contact Info', 'contactInfo'],
              ])}

              {role === 'creator' && renderFields([
                ['Education Qualification', 'educationQualification'],
                ['Expertise', 'expertise'],
                ['Portfolio', 'portfolio'],
                ['Languages', 'languages'],
                ['Years of Experience', 'yearsOfExperience'],
                ['LinkedIn URL', 'linkedInUrl'],
              ])}

              {role === 'validator' && renderFields([
                ['Languages', 'languages'],
                ['Years of Experience', 'yearsOfExperience'],
                ['Education Qualification', 'educationQualification'],
                ['Region', 'region'],
                ['Location', 'location'],
              ])}

              {role === 'validator' && (
                <>
                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="validatorBio"
                      value={form.validatorBio}
                      onChange={handleChange}
                      style={{ ...styles.inputHorizontal, height: '6rem', resize: 'none' }}
                      placeholder="Tell us something about yourself..."
                      required
                    />
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>ID Proof</Form.Label>
                    <Form.Control
                      type="file"
                      name="idProof"
                      onChange={handleChange}
                      style={styles.inputHorizontal}
                      required
                    />
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="certificate"
                      onChange={handleChange}
                      style={styles.inputHorizontal}
                      required
                    />
                  </Form.Group>
                </>
              )}

              {(role === 'creator' || role === 'validator') && (
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Project Links</Form.Label>
                  <div style={{ flex: 1 }}>
                    {form.projectLinks.map((link, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Form.Control
                          type="text"
                          placeholder={`Project Link ${i + 1}`}
                          value={link}
                          onChange={(e) => handleProjectLinkChange(i, e.target.value)}
                          style={{ ...styles.inputHorizontal, flex: 1 }}
                        />
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
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    style={{ ...styles.inputHorizontal, height: '6rem', resize: 'none' }}
                    placeholder="Tell us something about yourself..."
                    required
                  />
                </Form.Group>
              )}

              {["creator", "validator", "institution"].includes(role) && (
                <>
                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>Password</Form.Label>
                    <div style={styles.inputWrapper}>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                        required
                      />
                      <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>

                  <Form.Group style={styles.formGroup}>
                    <Form.Label style={styles.label}>Confirm Password</Form.Label>
                    <div style={styles.inputWrapper}>
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={{ ...styles.inputHorizontal, paddingRight: '2.5rem' }}
                        required
                      />
                      <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>
                </>
              )}

              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Phone</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={styles.inputHorizontal}
                    required
                  />
                  <Button variant="warning" style={styles.otpButton}>Send OTP</Button>
                </div>
              </Form.Group>

              <Form.Group style={styles.formGroup}>
                <Form.Label style={styles.label}>Enter OTP</Form.Label>
                <div style={{ display: 'flex', flex: 1, gap: '0.5rem' }}>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    style={styles.inputHorizontal}
                    placeholder="Enter OTP"
                  />
                  <Button variant="success" style={styles.otpVerifyButton}>Verify OTP</Button>
                </div>
              </Form.Group>

              {role === 'institution' && (
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Documents</Form.Label>
                  <Form.Control
                    type="file"
                    name="docs"
                    onChange={handleChange}
                    style={styles.inputHorizontal}
                  />
                </Form.Group>
              )}

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" style={styles.submitButton}>Register</Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );

  function renderFields(fields) {
    return fields.map(([label, name]) => (
      <Form.Group key={name} style={styles.formGroup}>
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
    ));
  }
}

const styles = {
  wrapper: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    paddingTop: '2.5rem',
    paddingBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '30rem',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
    border: 'none',
    backgroundColor: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#333333',
  },
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  label: {
    width: '120px',
    marginBottom: 0,
    fontWeight: '500',
    color: '#333',
  },
  inputHorizontal: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '1px solid rgb(220, 166, 57)',
    borderRadius: '0.5rem',
    height: '2.75rem',
    fontSize: '1rem',
    padding: '0 1rem',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#888',
    zIndex: 2,
  },
  submitButton: {
    backgroundColor: 'rgb(53, 168, 84)',
    color: '#fff',
    fontWeight: 600,
    padding: '0.6rem 2rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '0.5rem',
    width: 'fit-content',
    alignSelf: 'center',
    marginTop: '1rem',
  },
  otpButton: {
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(220, 166, 57)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
  },
  otpVerifyButton: {
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(53, 168, 84)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
  },
  addBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    borderRadius: '0.5rem',
    marginTop: '0.25rem',
  },
  removeBtn: {
    padding: '0 0.6rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    lineHeight: '1',
    borderRadius: '0.5rem',
    height: '2.75rem',
  },
};

export default RegisterInstitution;
