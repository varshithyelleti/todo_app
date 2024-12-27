import React from 'react';

interface HomeProps {
  children: React.ReactNode;
}

export default function Home({ children }: HomeProps) {
  return <>{children}</>;
}