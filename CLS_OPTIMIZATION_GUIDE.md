# CLS 최적화 가이드: 무한 스크롤에서의 레이아웃 시프트 방지

## 핵심 질문에 대한 답변

### Q1: 스켈레톤 없이 데이터를 로드하면 CLS가 떨어지나요?

**답변**: **기존 요소가 밀려나지 않고 스크롤만 발생한다면 CLS에 영향 없습니다.**

- CLS는 **기존 요소의 예상치 못한 이동**을 측정합니다
- 스크롤 영역 내에서 새 요소가 추가되어도, 기존 요소의 위치가 변하지 않으면 CLS 점수는 하락하지 않습니다
- 하지만 **초기 로딩 시 컨테이너 높이가 갑자기 변하면** CLS에 영향을 줄 수 있습니다

### Q2: 데이터 개수를 모를 때 스켈레톤을 어떻게 추가하나요?

**답변**: 다음 전략들을 조합하여 사용합니다:

1. **고정 높이 사용**: 각 아이템의 높이를 고정하여 레이아웃 시프트 방지
2. **스켈레톤을 실제 데이터와 동일한 구조로**: 실제 아이템과 동일한 레이아웃 유지
3. **최소 높이 보장**: 컨테이너에 최소 높이 설정
4. **점진적 로딩**: 초기에는 적은 수의 스켈레톤 표시, 데이터가 로드되면 추가

## 무한 스크롤 최적화 예시

### 방법 1: 고정 높이 + 동일 구조 스켈레톤

```tsx
// 각 아이템의 높이를 고정하여 CLS 방지
const ITEM_HEIGHT = 72; // 실제 아이템의 높이와 동일하게 설정

function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  return (
    <div className="space-y-0">
      {/* 기존 아이템들 */}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-4"
          style={{ height: `${ITEM_HEIGHT}px` }} // 고정 높이
        >
          {/* 실제 컨텐츠 */}
        </div>
      ))}

      {/* 로딩 중일 때 스켈레톤 - 동일한 높이와 구조 */}
      {isLoading && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex items-center gap-4 p-4"
              style={{ height: `${ITEM_HEIGHT}px` }} // 실제 아이템과 동일한 높이
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
```

### 방법 2: 최소 높이 보장

```tsx
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 로딩 시 최소 높이 보장
  const minHeight = isLoading && items.length === 0 ? '400px' : 'auto';

  return (
    <div style={{ minHeight }}>
      {items.length === 0 && isLoading ? (
        // 초기 로딩: 충분한 수의 스켈레톤 표시
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : (
        <>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
          {isLoading && (
            // 추가 로딩: 적은 수의 스켈레톤 표시
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
```

### 방법 3: CSS Grid를 활용한 레이아웃 고정

```tsx
function GridInfiniteScroll() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Grid를 사용하면 각 아이템의 높이가 자동으로 관리됨 */}
      {items.map((item) => (
        <div key={item.id} className="h-20">
          {/* 고정 높이로 CLS 방지 */}
        </div>
      ))}
      {isLoading && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="h-20">
              {/* 실제 아이템과 동일한 높이 */}
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
```

## 현재 코드 개선 사항

1. ✅ **스켈레톤을 TableRow 구조로 변경**: 실제 데이터와 동일한 구조 유지
2. ✅ **pageSize만큼 스켈레톤 표시**: 실제 로드될 데이터 개수와 일치
3. ✅ **TableBody 내부에 배치**: 테이블 구조를 유지하여 레이아웃 안정성 확보

## 추가 최적화 팁

1. **이미지 로딩**: `width`와 `height` 속성을 명시하여 레이아웃 시프트 방지
2. **폰트 로딩**: `font-display: swap` 사용 시 폴백 폰트와 동일한 메트릭 사용
3. **동적 컨텐츠**: `content-visibility: auto` 사용으로 렌더링 최적화
4. **Intersection Observer**: 뷰포트에 진입할 때만 로딩하여 초기 로딩 시간 단축

## 결론

- **스크롤 영역 내에서 요소가 추가되는 경우**: 기존 요소가 밀려나지 않으면 CLS에 영향 없음
- **스켈레톤은 실제 데이터와 동일한 구조/높이로**: 레이아웃 시프트 방지
- **고정 높이 사용**: 예측 가능한 레이아웃으로 CLS 최적화
- **초기 로딩 시 최소 높이 보장**: 갑작스러운 레이아웃 변화 방지
