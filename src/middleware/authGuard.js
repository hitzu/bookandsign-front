import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // test only 
      // localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJlbWFpbCI6InJvYmVydC50b3JyZXMubG9wZXpAZ21haWwuY29tIiwiaWF0IjoxNzM3MTM5NTg0LCJleHAiOjQ4NjEzNDE5ODR9._F57fDnAB90YoOPkrWvuEWy_UKmIKc-OLdIWt06UyMY');
      const token = localStorage.getItem('authToken');

      if (!token) {
        router.replace('/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
