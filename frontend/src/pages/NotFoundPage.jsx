import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

export const NotFoundPage = () => {
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center space-y-6 bg-white rounded-3xl border border-transt-border p-8 shadow-sm">
        <div className="inline-flex p-4 rounded-3xl bg-transt-surface-cream text-transt-green border border-transt-border">
          <HelpCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-transt-green-dark">404</h1>
          <h2 className="text-xl font-bold text-transt-text">Page Not Found</h2>
          <p className="text-sm text-transt-text-muted">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <Link to={ROUTES.HOME}>
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;
