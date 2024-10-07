# NestJS 기반 홈 자동화 시스템

## 설명

이 프로젝트는 NestJS 프레임워크를 사용하여 구축된 효율적이고 확장 가능한 서버 측 애플리케이션입니다. 주로 홈 자동화 시스템을 위한 백엔드 서비스를 제공합니다.

## 주요 기능

- 사용자 인증 및 권한 관리
- 장치 상태 모니터링 및 제어
- 실시간 이벤트 처리
- 타이머 기반 작업 관리
- 방 온도 제어 및 모니터링

## 설치

```bash
yarn
```

### 애플리케이션 실행

```bash
yarn start
```

### 개발 모드

```bash
yarn start
```

### 감시 모드

```bash
yarn start:dev
```

### 프로덕션 모드

```bash
yarn start:prod
```

## 테스트

### 단위 테스트

```bash
yarn test
```

### e2e 테스트

```bash
yarn test:e2e
```

### 테스트 커버리지

```bash
yarn test:cov
```

## 프로젝트 구조

- `src/auth`: 인증 관련 모듈
- `src/device`: 장치 관리 모듈
- `src/device-control`: 장치 제어 모듈
- `src/device-state`: 장치 상태 관리 모듈
- `src/hejhome-api`: 외부 API 통신 모듈
- `src/hejhome-message-queue`: 메시지 큐 관리 모듈
- `src/init`: 초기화 모듈
- `src/room`: 방 관리 모듈
- `src/task`: 작업 스케줄링 모듈
- `src/timer-manager`: 타이머 관리 모듈

## 환경 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요.

- `CLIENT_ID`: API 클라이언트 ID
- `CLIENT_SECRET`: API 클라이언트 시크릿

프로젝트 루트에 `hej-code.json` 파일을 생성하고 다음 환경 변수를 설정하세요.
json 형식으로 아래와 같이 작성해주세요.

```json
{
  "access_token": "액세스 토큰",
  "refresh_token": "리프레시 토큰"
}
```

- `access_token`: 액세스 토큰
- `refresh_token`: 리프레시 토큰
- `expires_in`: 토큰 만료 시간

expires_in 이 없으면 자동으로 토큰을 재발급 받습니다.
위 파일을 통해 토큰을 발급하며, 토큰이 만료되면 자동으로 갱신됩니다.

## 기여

프로젝트에 기여하고 싶으시다면 풀 리퀘스트를 보내주세요. 모든 기여는 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
