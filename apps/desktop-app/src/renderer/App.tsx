import React from 'react';
import ErrorPage from './ErrorPage';

/**
 * 데스크톱 앱의 로컬 렌더러 엔트리 포인트입니다.
 * 원격 서버(localhost:3000) 접속에 실패했을 때 나타나는 기본 화면(Error/Fallback)을 관리합니다.
 */
const App: React.FC = () => {
  return <ErrorPage />;
};

export default App;
