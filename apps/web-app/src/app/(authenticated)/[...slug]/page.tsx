import { notFound } from 'next/navigation';

// (authenticated) 레이아웃 안에서 매칭되지 않는 모든 경로를 잡아
// not-found.tsx가 사이드바/공통헤더를 포함한 레이아웃으로 렌더링되도록 합니다.
export default function CatchAllPage() {
  notFound();
}
