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

## 푸시 발송 참고 사항

푸시 발송은 [ntfy 서비스](https://ntfy.sh/)를 사용하여 발송이 됩니다.
WEBHOOK_URL 환경 변수를 설정하여 발송이 가능하며, 발송을 받을 클라이언트에서 구독을 하면 발송을 받는 방식입니다

## 테스트 커버리지

<!-- coverage.md -->
St|File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s    
--|-----------------------------------|---------|----------|---------|---------|----------------------
🟡|All files                          |   78.04 |    53.84 |    56.6 |   76.67 |                      
🔴|&nbsp;src|       0 |      100 |       0 |       0 |                      
🔴|&nbsp;&nbsp;[main.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/main.ts)|       0 |      100 |       0 |       0 |[1-11](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/main.ts#L1-L11)
🟢|&nbsp;src/auth|     100 |    66.66 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[auth.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/auth/auth.service.ts)|     100 |    66.66 |     100 |     100 |[23](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/auth/auth.service.ts#L23)
🔴|&nbsp;src/device|   44.44 |        0 |     7.4 |   40.62 |                      
🔴|&nbsp;&nbsp;[cloud-device.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/cloud-device.service.ts)|    37.5 |      100 |       0 |   28.57 |[12-41](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/cloud-device.service.ts#L12-L41)
🔴|&nbsp;&nbsp;[database-device.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/database-device.service.ts)|   34.28 |        0 |    7.69 |   32.25 |[26-102](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/database-device.service.ts#L26-L102)
🟡|&nbsp;&nbsp;[device.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts)|   66.66 |      100 |    12.5 |   63.15 |[12](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L12),[16](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L16),[20](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L20),[28](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L28),[36](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L36),[44](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L44),[49](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/device.controller.ts#L49)
🟡|&nbsp;src/device-control|      72 |        0 |   28.57 |   66.66 |                      
🟡|&nbsp;&nbsp;[device-control.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-control/device-control.controller.ts)|   73.33 |        0 |   33.33 |   69.23 |[18-25](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-control/device-control.controller.ts#L18-L25)
🟡|&nbsp;&nbsp;[device-control.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-control/device-control.service.ts)|      70 |      100 |      25 |    62.5 |[12-25](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-control/device-control.service.ts#L12-L25)
🟢|&nbsp;src/device-state|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[device-state.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-state/device-state.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[device-state.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device-state/device-state.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/device/entities|    87.5 |      100 |      50 |   83.33 |                      
🟢|&nbsp;&nbsp;[device.entity.subscriber.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/entities/device.entity.subscriber.ts)|    87.5 |      100 |      50 |   83.33 |[12](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/device/entities/device.entity.subscriber.ts#L12)
🟢|&nbsp;src/hejhome-api|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[hejhome-api.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/hejhome-api/hejhome-api.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/hejhome-message-queue|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[hejhome-message-queue.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/hejhome-message-queue/hejhome-message-queue.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/init|   93.75 |      100 |      80 |   93.33 |                      
🟢|&nbsp;&nbsp;[init.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/init/init.service.ts)|   93.75 |      100 |      80 |   93.33 |[25](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/init/init.service.ts#L25),[50](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/init/init.service.ts#L50)
🟢|&nbsp;src/message-template|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[message-template.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/message-template/message-template.controller.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[message-template.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/message-template/message-template.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/message-template/dto|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[create-message-template.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/message-template/dto/create-message-template.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;&nbsp;[update-message-template.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/message-template/dto/update-message-template.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/push-messaging|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[push-messaging.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/push-messaging/push-messaging.service.ts)|     100 |      100 |     100 |     100 |
🟡|&nbsp;src/room|    52.7 |       25 |   38.09 |   51.51 |                      
🟢|&nbsp;&nbsp;[room.controller.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.controller.ts)|   84.21 |      100 |      75 |   82.35 |[14-16](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.controller.ts#L14-L16)
🔴|&nbsp;&nbsp;[room.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.service.ts)|   41.81 |       25 |   29.41 |   40.81 |[32](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.service.ts#L32),[43-62](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.service.ts#L43-L62),[70-123](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/room.service.ts#L70-L123)
🟢|&nbsp;src/room/dto|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[updateRoom.dto.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/room/dto/updateRoom.dto.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/task|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[task.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/task/task.service.ts)|     100 |      100 |     100 |     100 |
🟢|&nbsp;src/timer-manager|     100 |      100 |     100 |     100 |                      
🟢|&nbsp;&nbsp;[timer-manager.service.ts](https://github.com/sungmun/local-automation-system-nestjs/blob/6e2bd7d7d268eb61d48094c332a24c33a965add9/src/timer-manager/timer-manager.service.ts)|     100 |      100 |     100 |     100 |

## 기여

프로젝트에 기여하고 싶으시다면 풀 리퀘스트를 보내주세요. 모든 기여는 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
