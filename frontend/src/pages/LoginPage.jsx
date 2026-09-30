import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { loginAsync, clearError } from '../store/slices/authSlice';
import { ROUTES } from '../utils/constants';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Determine redirect target (either the page they tried to access or home)
  const from = location.state?.from?.pathname || ROUTES.HOME;
  const registrationSuccessMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // If already logged in, redirect to destination
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      loginAsync({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transt-green-dark">
          Sign in to Transt
        </h2>
        <p className="text-xs sm:text-sm text-transt-text-muted">
          Access your Transt account to manage orders & checkout
        </p>
      </div>

      {/* Registration success alert if redirected from registration */}
      {registrationSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-transt-success-light border border-transt-green-subtle text-transt-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{registrationSuccessMessage}</span>
        </div>
      )}

      {/* Backend API Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-transt-error-light border border-transt-error text-transt-error text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          id="login-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          error={validationErrors.email}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          id="login-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={validationErrors.password}
          autoComplete="current-password"
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full justify-center shadow-md py-3"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-transt-border-subtle text-center space-y-2 text-xs text-transt-text-muted">
        <p>
          Don't have a Transt account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-transt-green font-bold hover:underline"
          >
            Create account
          </Link>
        </p>
        <p>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center text-transt-text-muted hover:text-transt-green transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
