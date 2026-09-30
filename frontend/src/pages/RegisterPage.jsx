import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { registerAsync, clearError } from '../store/slices/authSlice';
import { ROUTES } from '../utils/constants';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirm_password) {
      errors.confirm_password = 'Password confirmation is required.';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match.';
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

    const result = await dispatch(
      registerAsync({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      })
    );

    if (registerAsync.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN, {
        state: {
          message: 'Account created successfully! Please sign in with your credentials.',
          email: formData.email.trim().toLowerCase(),
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transt-green-dark">
          Create Transt Account
        </h2>
        <p className="text-xs sm:text-sm text-transt-text-muted">
          Join Transt for faster ordering, address management & delivery tracking
        </p>
      </div>

      {/* Backend API Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-transt-error-light border border-transt-error text-transt-error text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          id="register-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          error={validationErrors.name}
          autoComplete="name"
          required
        />

        <Input
          label="Email Address"
          id="register-email"
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
          id="register-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 6 characters"
          error={validationErrors.password}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          id="register-confirm-password"
          name="confirm_password"
          type="password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={validationErrors.confirm_password}
          autoComplete="new-password"
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
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-transt-border-subtle text-center space-y-2 text-xs text-transt-text-muted">
        <p>
          Already have a Transt account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-transt-green font-bold hover:underline"
          >
            Sign in here
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

export default RegisterPage;
