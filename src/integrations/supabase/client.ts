
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wvdkrkwdmtnpqsdovzij.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZGtya3dkbXRucHFzZG92emlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDkzMjQsImV4cCI6MjA1ODEyNTMyNH0.4xq-9sXN_kt8fXmCXLNft6b_Gb7Tf2N0Wz8C10xD2-s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper for checking if user is admin
export const isAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === 'suiteoctopus@gmail.com';
};

// Timezone configuration for Brazil/SP
export const formatLocalDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  }).format(date);
};

export const formatLocalDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  }).format(date);
};

// Utility to check if a file URL is in the Supabase buckets
export const getStorageUrl = (path: string): string => {
  if (!path || path.startsWith('http')) return path;
  
  // Make sure we're checking for both virtus and outliers buckets
  if (path.includes('/virtus/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/virtus/${path.split('/virtus/')[1]}`;
  } else if (path.includes('/outliers/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/outliers/${path.split('/outliers/')[1]}`;
  }
  
  // Default case, just prepend the URL to the outliers bucket path
  return `${SUPABASE_URL}/storage/v1/object/public/outliers/${path}`;
};

// Create storage buckets if they don't exist
export const createBucketsIfNotExist = async () => {
  try {
    // Check if the outliers bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'outliers')) {
      await supabase.storage.createBucket('outliers', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      console.log('Created outliers bucket');
    }
    
    if (!buckets?.find(bucket => bucket.name === 'virtus')) {
      await supabase.storage.createBucket('virtus', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      console.log('Created virtus bucket');
    }
  } catch (error) {
    console.error('Error creating buckets:', error);
  }
};

// Check for buckets when the app initializes
createBucketsIfNotExist();
