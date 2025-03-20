'use client';

import { useState } from 'react';
import UserTypeSelector from '@/components/UserTypeSelector';
import Terminal from '@/components/Terminal';
import NonDeveloperInterface from '@/components/LandingPage';

type UserType = 'developer' | 'non-developer' | null;

export default function Home() {
  const [userType, setUserType] = useState<UserType>(null);

  if (!userType) {
    return <UserTypeSelector onSelect={setUserType} />;
  }

  return (
    <>
      {userType === 'developer' ? (
        <Terminal onToggle={() => setUserType('non-developer')} />
      ) : (
        <NonDeveloperInterface onToggle={() => setUserType('developer')} />
      )}
    </>
  );
}
