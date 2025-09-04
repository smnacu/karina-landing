"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { UserRole } from '@/types';

interface WithAuthProps {
  allowedRoles?: UserRole[];
}

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  { allowedRoles }: WithAuthProps = {}
) => {
  const AuthComponent = (props: P) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      } else if (!isLoading && isAuthenticated && allowedRoles) {
        if (!user || !allowedRoles.includes(user.role)) {
          router.push('/'); // Redirect to a "not authorized" page or home
        }
      }
    }, [isAuthenticated, isLoading, user, router, allowedRoles]);

    if (isLoading || !isAuthenticated) {
      // You can render a loading spinner here
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <div className="min-h-screen flex items-center justify-center">Not Authorized.</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
