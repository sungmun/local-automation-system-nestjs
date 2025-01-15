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

## 이벤트 종류

- `set.{deviceType}.**`: 장치 상태가 변경이 됬는지 안됬는지 확인이 필요할때 발생
- `changed.{deviceType}.**`: 장치의 상태가 변경이 됬을 때 발생
- `finish.{deviceType}.**`: 장치의 상태가 변경이 되고 모든 작업이 완료되었을 때 발생
- `recipe.condition.check`: 레시피 조건이 충족되었을 때 발생

## 푸시 발송 참고 사항

푸시 발송은 [ntfy 서비스](https://ntfy.sh/)를 사용하여 발송이 됩니다.
WEBHOOK_URL 환경 변수를 설정하여 발송이 가능하며, 발송을 받을 클라이언트에서 구독을 하면 발송을 받는 방식입니다

## 테스트 커버리지

<!-- coverage.md -->
St|File                                                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--|-----------------------------------------------------------------|---------|----------|---------|---------|-------------------
🟢|All files                                                        |      97 |    93.93 |   95.85 |    97.1 |                   
🟢|&nbsp;auth|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[auth.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/auth/auth.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;common/decorators|   95.65 |      100 |     100 |   95.23 |                   
🟢|&nbsp;&nbsp;[safe-event.decoratot.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/decorators/safe-event.decoratot.ts)|   94.11 |      100 |     100 |   93.33 |[19](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/decorators/safe-event.decoratot.ts#L19)
🟢|&nbsp;&nbsp;[transform-date.decorator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/decorators/transform-date.decorator.ts)|     100 |      100 |     100 |     100 |
🔴|&nbsp;common/interceptors|       0 |      100 |       0 |       0 |                   
🔴|&nbsp;&nbsp;[logging.interceptor.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/interceptors/logging.interceptor.ts)|       0 |      100 |       0 |       0 |[1-27](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/interceptors/logging.interceptor.ts#L1-L27)
🟢|&nbsp;common/validators|   97.91 |       50 |     100 |   97.77 |                   
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/validators/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[is-array-uniq-type.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/validators/is-array-uniq-type.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[is-record-type.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/validators/is-record-type.validator.ts)|   95.45 |       50 |     100 |   95.23 |[22](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/validators/is-record-type.validator.ts#L22)
🟢|&nbsp;&nbsp;[is-time-range.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/common/validators/is-time-range.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;device|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[cloud-device.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/cloud-device.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[database-device.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/database-device.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[device.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/device.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[device.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/device.handler.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;device-control|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[device-control.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device-control/device-control.handler.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[device-control.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device-control/device-control.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;device-state|   86.84 |       75 |   85.71 |   85.29 |                   
🟢|&nbsp;&nbsp;[device-state.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device-state/device-state.handler.ts)|     100 |      100 |     100 |     100 |
🟡|&nbsp;&nbsp;[device-state.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device-state/device-state.service.ts)|      75 |       50 |      75 |   72.22 |[15-21](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device-state/device-state.service.ts#L15-L21)
🟢|&nbsp;device/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[device.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/device.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-with-device.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/room-with-device.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;device/dto/response|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[connect-device-to-message-template-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/response/connect-device-to-message-template-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[detail-device-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/response/detail-device-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/response/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[list-device-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/dto/response/list-device-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;device/entities|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[device.entity.subscriber.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/device/entities/device.entity.subscriber.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;hejhome-api|   95.45 |      100 |   93.75 |   95.23 |                   
🟢|&nbsp;&nbsp;[hejhome-api.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/hejhome-api/hejhome-api.service.ts)|   95.45 |      100 |   93.75 |   95.23 |[122-126](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/hejhome-api/hejhome-api.service.ts#L122-L126)
🟢|&nbsp;hejhome-message-queue|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[hejhome-message-queue.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/hejhome-message-queue/hejhome-message-queue.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;init|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[init.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/init/init.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;log|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[log.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/log.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[log.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/log.handler.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[log.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/log.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;log/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[log.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/dto/log.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;log/dto/response|      90 |      100 |       0 |      90 |                   
🟢|&nbsp;&nbsp;[list-log-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/dto/response/list-log-response.dto.ts)|      90 |      100 |       0 |      90 |[31](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/log/dto/response/list-log-response.dto.ts#L31)
🟢|&nbsp;message-template|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[message-template.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/message-template.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[message-template.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/message-template.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;message-template/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[message-template.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/message-template.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;message-template/dto/request|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[create-message-template-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/request/create-message-template-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/request/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[update-message-template-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/request/update-message-template-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;message-template/dto/response|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[create-message-template-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/response/create-message-template-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[detail-message-template-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/response/detail-message-template-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/response/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[list-message-template-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/response/list-message-template-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[message-template-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/message-template/dto/response/message-template-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;push-messaging|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[push-messaging.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/push-messaging/push-messaging.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe|   93.63 |    83.33 |   86.36 |   93.13 |                   
🟢|&nbsp;&nbsp;[recipe-crud.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe-crud.service.ts)|   84.21 |    77.77 |   71.42 |   83.33 |[70](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe-crud.service.ts#L70),[86-101](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe-crud.service.ts#L86-L101)
🟢|&nbsp;&nbsp;[recipe.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe.controller.ts)|     100 |      100 |     100 |     100 |
🟡|&nbsp;&nbsp;[recipe.exception.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe.exception.ts)|      80 |      100 |      50 |      80 |[11](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe.exception.ts#L11)
🟢|&nbsp;&nbsp;[recipe.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe.handler.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/recipe.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[recipe-command.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/recipe-command.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command/dto|   92.59 |      100 |     100 |   92.59 |                   
🟢|&nbsp;&nbsp;[hej-home-recipe-command.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/hej-home-recipe-command.dto.ts)|     100 |      100 |     100 |     100 |
🔴|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/index.ts)|       0 |      100 |     100 |       0 |[1-2](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/index.ts#L1-L2)
🟢|&nbsp;&nbsp;[local-push-message-recipe-command.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/local-push-message-recipe-command.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-timer-recipe-command.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/local-timer-recipe-command.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-command.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/recipe-command.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command/dto/request|      88 |      100 |     100 |      88 |                   
🟢|&nbsp;&nbsp;[hej-home-recipe-command-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/hej-home-recipe-command-request.dto.ts)|     100 |      100 |     100 |     100 |
🔴|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/index.ts)|       0 |      100 |     100 |       0 |[1-3](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/index.ts#L1-L3)
🟢|&nbsp;&nbsp;[local-push-message-recipe-command-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/local-push-message-recipe-command-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-timer-recipe-command-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/local-timer-recipe-command-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-command-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/request/recipe-command-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command/dto/response|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[hej-home-recipe-command-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/response/hej-home-recipe-command-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/response/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-push-message-recipe-command-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/response/local-push-message-recipe-command-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-timer-recipe-command-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/response/local-timer-recipe-command-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-command-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/dto/response/recipe-command-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command/entities/child-recipe-command|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/entities/child-recipe-command/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-command/runners|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[command-runner.factory.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/command-runner.factory.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[hej-home-recipe-command.runner.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/hej-home-recipe-command.runner.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-push-message-recipe-command.runner.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/local-push-message-recipe-command.runner.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[local-timer-recipe-command.runner.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/local-timer-recipe-command.runner.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[runner-context.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/runner-context.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[runner.registry.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-command/runners/runner.registry.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition|   86.48 |     92.3 |    87.5 |   89.55 |                   
🔴|&nbsp;&nbsp;[recipe-condition.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/recipe-condition.handler.ts)|       0 |      100 |       0 |       0 |[1-13](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/recipe-condition.handler.ts#L1-L13)
🟢|&nbsp;&nbsp;[recipe-condition.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/recipe-condition.service.ts)|   98.46 |     92.3 |     100 |     100 |[36](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/recipe-condition.service.ts#L36)
🟢|&nbsp;recipe-condition/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[base-recipe-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/base-recipe-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-condition-group.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-condition-group.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/dto/recipe-conditions|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[daily-recurring-schedule-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/daily-recurring-schedule-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[daily-recurring-schedule-time-range-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/daily-recurring-schedule-time-range-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[hej-home-device-state-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/hej-home-device-state-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/reserve-time-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-range-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/reserve-time-range-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-humidity-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/room-humidity-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-temperature-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/room-temperature-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[status-delay-maintain-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/status-delay-maintain-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/weekly-recurring-schedule-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-time-range-condition.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/recipe-conditions/weekly-recurring-schedule-time-range-condition.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/dto/request|   95.65 |      100 |     100 |   95.23 |                   
🟢|&nbsp;&nbsp;[base-recipe-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/base-recipe-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[create-condition-group-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/create-condition-group-request.dto.ts)|     100 |      100 |     100 |     100 |
🔴|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/index.ts)|       0 |      100 |     100 |       0 |[1](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/index.ts#L1)
🟢|&nbsp;recipe-condition/dto/request/recipe-condition-requests|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[daily-recurring-schedule-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/daily-recurring-schedule-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[daily-recurring-schedule-time-range-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/daily-recurring-schedule-time-range-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[hej-home-device-state-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/hej-home-device-state-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-condition-reserve-time-range-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/recipe-condition-reserve-time-range-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/reserve-time-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-humidity-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/room-humidity-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-temperature-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/room-temperature-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[status-delay-maintain-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/status-delay-maintain-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/weekly-recurring-schedule-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-time-range-condition-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/request/recipe-condition-requests/weekly-recurring-schedule-time-range-condition-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/dto/response|      90 |      100 |     100 |    87.5 |                   
🔴|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/index.ts)|       0 |      100 |     100 |       0 |[1](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/index.ts#L1)
🟢|&nbsp;&nbsp;[recipe-condition-group-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-group-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/dto/response/recipe-condition-responses|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[daily-recurring-schedule-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/daily-recurring-schedule-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[daily-recurring-schedule-time-range-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/daily-recurring-schedule-time-range-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[hej-home-device-state-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/hej-home-device-state-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/reserve-time-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-range-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/reserve-time-range-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-humidity-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/room-humidity-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-temperature-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/room-temperature-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[status-delay-maintain-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/status-delay-maintain-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/weekly-recurring-schedule-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-time-range-condition-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/dto/response/recipe-condition-responses/weekly-recurring-schedule-time-range-condition-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/entities/child-recipe-conditions|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/entities/child-recipe-conditions/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe-condition/validators|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[base.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/base.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[condition-validator.factory.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/condition-validator.factory.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[daily-recurring-schedule-time-range.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/daily-recurring-schedule-time-range.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[daily-recurring-schedule.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/daily-recurring-schedule.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[hej-home-device-state.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/hej-home-device-state.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[humidity.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/humidity.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time-range.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/reserve-time-range.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[reserve-time.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/reserve-time.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[status-delay-maintain.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/status-delay-maintain.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[temperature.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/temperature.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[validation-context.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/validation-context.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[validator.registry.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/validator.registry.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule-time-range.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/weekly-recurring-schedule-time-range.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[weekly-recurring-schedule.validator.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe-condition/validators/weekly-recurring-schedule.validator.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[recipe.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/recipe.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe/dto/request|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[create-recipe-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/request/create-recipe-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/request/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[update-recipe-request.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/request/update-recipe-request.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;recipe/dto/response|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[detail-recipe-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/response/detail-recipe-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[index.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/response/index.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[list-recipe-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/recipe/dto/response/list-recipe-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;room|   98.13 |      100 |   92.85 |   97.84 |                   
🟢|&nbsp;&nbsp;[hej-home-room.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/hej-home-room.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room-crud.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room-crud.service.ts)|      90 |      100 |   71.42 |   88.88 |[27](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room-crud.service.ts#L27),[48](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room-crud.service.ts#L48)
🟢|&nbsp;&nbsp;[room-sensor.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room-sensor.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room.handler.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room.handler.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[room.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/room.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;room/dto|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[room.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/dto/room.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;room/dto/response|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[list-room-response.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/room/dto/response/list-room-response.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;task|     100 |      100 |     100 |     100 |                   
🟢|&nbsp;&nbsp;[device-check.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/task/device-check.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[recipe-check.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/task/recipe-check.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[task.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/task/task.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;timer-manager|      95 |      100 |   85.71 |     100 |                   
🟢|&nbsp;&nbsp;[timer-manager.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/efc0e9420b8842508fbc6e8ce15b61cda0f92eaf/src/timer-manager/timer-manager.service.ts)|      95 |      100 |   85.71 |     100 |

## 기여

프로젝트에 기여하고 싶으시다면 풀 리퀘스트를 보내주세요. 모든 기여는 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
