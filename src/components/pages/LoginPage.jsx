import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
};

const LoginPage = () => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const resetSignupFields = () => {
    setName('');
    setJobTitle('');
    setDepartment('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup(email, password, { name, jobTitle, department });
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(AUTH_ERROR_MESSAGES[err.code] || err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-card ${isSignup ? 'login-card-signup' : ''}`}>
        <header className="login-header">
          <h2 className="brand-name">Questify</h2>
          <p className="tagline">AI-Powered Assessment Made Simple</p>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
          {isSignup && (
            <>
              <Input
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Senior Biology Teacher"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                icon={Briefcase}
                required
              />
              <Input
                label="Department"
                type="text"
                placeholder="e.g. Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                icon={Building2}
                required
              />
            </>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@school.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />
          
          <div className="password-group">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              required
            />
            {!isSignup && (
              <a href="#" className="forgot-password">Forgot Password?</a>
            )}
          </div>

          {error && <p className="login-error">{error}</p>}

          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            icon={ArrowRight} 
            className="login-btn"
            disabled={submitting}
          >
            {submitting ? (isSignup ? 'Creating account…' : 'Signing in…') : (isSignup ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <footer className="login-footer">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="signup-link"
              onClick={() => {
                setIsSignup((prev) => !prev);
                setError('');
                resetSignupFields();
              }}
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
          <div className="legal-links">
            <span>© 2024 Questify</span>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
