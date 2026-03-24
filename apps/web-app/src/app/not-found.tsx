'use client';

import AppErrorView from '../components/shared/AppErrorView';

export default function NotFound() {
  return (
    <AppErrorView 
      statusCode={404} 
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않거나 현재 접근 불가능한 상태입니다. 입력하신 주소를 다시 한 번 확인해 주세요."
    />
  );
}
