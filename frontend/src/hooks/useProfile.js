import { useState, useEffect } from 'react';

// Simple global cache to prevent multiple fetches across components
let globalProfileCache = null;
let fetchPromise = null;

export const useProfile = () => {
  const [profile, setProfile] = useState(globalProfileCache);
  const [loading, setLoading] = useState(!globalProfileCache);

  useEffect(() => {
    if (globalProfileCache) {
      setProfile(globalProfileCache);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = fetch('http://localhost:5000/api/v1/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            globalProfileCache = data.data;
          }
          return globalProfileCache;
        })
        .catch(err => {
          console.error("Failed to fetch profile", err);
          return null;
        });
    }

    fetchPromise.then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  return { profile, loading };
};
