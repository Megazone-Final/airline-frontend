# airline-front

`airline-front`는 항공권 검색, 예약, 결제, 마이페이지 조회를 담당하는 사용자용 웹 프론트엔드입니다.

## 기술 스택

- React 19
- React Router
- Axios
- Vite
- Nginx

## 주요 화면

- `/` : 메인 화면 및 빠른 항공편 검색
- `/flights` : 항공편 검색 결과 목록
- `/booking/:flightId` : 승객 정보 입력
- `/payment` : 결제 화면
- `/register` : 회원가입
- `/login` : 로그인
- `/mypage` : 예약/결제 내역 조회

## 디렉터리 구조

- `src/pages/` : 페이지 컴포넌트
- `src/components/` : 공통 레이아웃, 네비게이션, 푸터, 보호 라우트
- `src/api/` : 백엔드 API 호출 모듈
- `src/context/` : 인증 상태 관리
- `docs/API_SPECIFICATION.md` : 프론트 기준 API 명세
- `Dockerfile`, `nginx.conf` : 컨테이너 이미지 및 프록시 설정
- `k8s/` : 프론트엔드의 Kubernetes 배포 참고 자료

## 로컬 실행

```bash
npm install
npm run dev
```

기본 접속 주소:

- `http://localhost:3000`

## API 연결 방식

프론트엔드는 상대 경로 `/api`를 사용합니다.

- `/api/auth/users/*`
- `/api/flight/*`
- `/api/payment/*`

현재 `vite.config.js`의 개발 프록시는 `/api` 요청을 아래 주소로 전달합니다.

- `https://izones.cloud`

로컬 백엔드와 연결하려면 `vite.config.js`의 아래 값을 수정해야 합니다.

- `server.proxy['/api'].target`

## 빌드

```bash
npm run build
```

빌드 산출물:

- `dist/`

로컬 프리뷰:

```bash
npm run preview
```

## Docker

멀티 스테이지 Docker 빌드가 포함되어 있습니다.

```bash
docker build -t airline-front .
docker run --rm -p 8080:80 airline-front
```

컨테이너 내부 동작:

- 정적 파일은 Nginx가 서빙
- SPA 라우트는 `index.html`로 fallback
- `/api/` 요청은 `http://api-gateway:8080/api/`로 프록시

## 배포

GitHub Actions 워크플로:

- `.github/workflows/deploy.yml`

현재 배포 흐름:

1. `main` 브랜치 푸시 시 빌드
2. `dist/`를 S3에 업로드
3. CloudFront 캐시 무효화

필요한 GitHub Secrets:

- `AWS_ROLE_ARN`
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`

## 참고 사항

- 일부 화면은 백엔드 연결 실패 시 데모 데이터로 fallback 되도록 작성되어 있습니다.
- 현재 운영 배포 경로는 Kubernetes가 아니라 S3 + CloudFront입니다.
- `k8s/README.md`는 참고용이며 운영 기준 문서는 아닙니다.
