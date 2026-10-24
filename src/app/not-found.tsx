import Curly404Page from '@/components/curly404/Curly404Page';

export default function NotFound() {
  return (
    <Curly404Page
      theme="purple"
      headline="This page doesn't exist or has been removed from the grid."
      homeUrl="/"
    />
  );
}
