# 보기 패널 기능 구현 로그

**날짜**: 2026-04-16  
**작업자**: Antigravity  
**상태**: ✅ 완료

---

## 개요

`ViewOptionsPopover`에 이미 존재하던 보기 설정 UI(보기 모드, 썸네일 품질, 정렬 방법) 값이
실제 렌더링에 반영되지 않던 문제를 해결하고, 각 옵션을 완전히 구현했습니다.

---

## 구현 항목

### 1. 보기 모드 (layout)

| 모드 | 동작 |
|---|---|
| `grid` | CSS Grid (`auto-fill`, 고정 행 높이) |
| `masonry` | CSS `column-width` 기반 폭포형 (기존 기본 동작) |
| `list` | `flex-col` 수직 리스트 |

**변경 파일**: `packages/ui/src/composition/NVAssetGrid/NVAssetGrid.tsx`

- `layout` prop 추가 (`'grid' | 'masonry' | 'list'`, 기본값 `'masonry'`)
- grid 모드: `gridTemplateColumns: repeat(auto-fill, minmax(${columnWidth}px, 1fr))`
- list 모드: `flex flex-col gap-1.5`
- 모바일에서는 layout 무시, 항상 masonry 유지 (`AssetGrid.tsx`에서 강제)

---

### 2. 썸네일 품질 (thumbnail)

| 옵션 | 동작 |
|---|---|
| `quality` | `loading="eager"` — 즉시 로드 |
| `speed` | `loading="lazy"` — 뷰포트 근접 시 로드 |

**변경 파일 체인**:
```
useAssetStore (viewOptions.thumbnail)
  → AssetGrid (thumbnailQuality prop 전달)
    → AssetCard (thumbnailQuality prop 전달)
      → NVAssetCard (thumbnailQuality prop 전달)
        → AssetCardImage (img[loading] 속성 적용)
```

- `AssetCard.tsx` — `thumbnailQuality?: 'speed' | 'quality'` prop 추가
- `NVAssetCard/index.tsx` — 동일 prop 추가, `AssetCardImage`로 전달
- `NVAssetCard/parts/AssetCardImage.tsx` — `loading` 속성 동적 적용

---

### 3. 정렬 방법 (sortMethod / sortOrder)

| 옵션 | 정렬 기준 |
|---|---|
| `default` | 정렬 없음 (서버/저장소 순서 유지) |
| `name` | 파일명 알파벳/가나다순 (`localeCompare, numeric`) |
| `date` | 생성일 기준 |

정렬 방향: `asc` (오름차순) / `desc` (내림차순)

**변경 파일**: `apps/web-app/src/hooks/features/useLibraryFilters.ts`

- `viewOptions`를 `useAssetStore`에서 구독
- 필터링 완료 후 sort 단계 추가
- `sortMethod === 'default'`일 때는 sort 생략 (불필요한 배열 복사 방지)
- `useMemo` 의존성에 `viewOptions` 추가

---

## 연결 구조

```
useAssetStore.viewOptions
  ├── layout ──→ AssetGrid → NVAssetGrid (layout prop)
  ├── thumbnail → AssetGrid → AssetCard → NVAssetCard → AssetCardImage (loading)
  └── sortMethod/sortOrder → useLibraryFilters (filteredAssets 정렬)
```

---

## 테스트 시나리오

| # | 시나리오 | 예상 결과 | 확인 |
|---|---|---|---|
| T-1 | 보기 옵션 팝오버 → 보기 모드: grid 선택 | 에셋이 균등 격자로 배치됨 | ✅ |
| T-2 | 보기 모드: masonry 선택 | 에셋이 폭포형으로 배치됨 | ✅ |
| T-3 | 보기 모드: list 선택 | 에셋이 세로 리스트로 나열됨 | ✅ |
| T-4 | 썸네일: 속도 → 에셋 카드 DOM 확인 | `<img loading="lazy">` | ✅ |
| T-5 | 썸네일: 품질 → 에셋 카드 DOM 확인 | `<img loading="eager">` | ✅ |
| T-6 | 정렬: 이름순 오름차순 | 에셋이 A-Z/가나다 순으로 정렬됨 | ✅ |
| T-7 | 정렬: 이름순 내림차순 | 에셋이 Z-A 순으로 정렬됨 | ✅ |
| T-8 | 정렬: 날짜순 내림차순 | 최신 등록 에셋이 상단에 노출됨 | ✅ |
| T-9 | 정렬: 기본 → 정렬 없음 | 기존 순서 유지 | ✅ |
| T-10 | 모바일 보기 모드 변경 | 모바일은 항상 masonry 유지됨 | ✅ |

> **테스트 방법**: 브라우저에서 보기 옵션 팝오버 (우상단 격자 아이콘) 열기 → 각 옵션 변경 → 즉시 반영 확인

---

## 관련 파일 목록

| 파일 | 변경 유형 |
|---|---|
| `packages/ui/src/composition/NVAssetGrid/NVAssetGrid.tsx` | feat: layout prop |
| `packages/ui/src/molecules/NVAssetCard/index.tsx` | feat: thumbnailQuality prop |
| `packages/ui/src/molecules/NVAssetCard/parts/AssetCardImage.tsx` | feat: thumbnailQuality 적용 |
| `apps/web-app/src/components/library/AssetCard.tsx` | feat: thumbnailQuality prop 전달 |
| `apps/web-app/src/components/library/AssetGrid.tsx` | feat: viewOptions 연결 |
| `apps/web-app/src/hooks/features/useLibraryFilters.ts` | feat: sort 로직 추가 |

---

## 미구현 / 향후 개선 사항

- **list 모드 레이아웃 디자인**: 현재 카드 형태 그대로 세로 나열. 파일명/메타정보 표시에 최적화된 별도 리스트 셀 컴포넌트 필요
- **showName, showInfo 등 toggle 옵션**: `viewOptions`에 값은 있으나 카드에 미반영 (추후 `NVAssetCard`에 적용 필요)
- **정렬 상태 localStorage 영속성**: 현재 리로드 시 기본값으로 초기화됨
