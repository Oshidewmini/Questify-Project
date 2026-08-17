import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h2 className="brand-name">Questify</h2>
          <p className="tagline">AI-Powered Assessment Made Simple</p>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
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
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            icon={ArrowRight} 
            className="login-btn"
          >
            Sign In
          </Button>
        </form>

        <footer className="login-footer">
          <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
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
