# EduMission Engine

## 파일 구조

- `edumission.js` - 브라우저용 클라이언트 엔진
- `edumission_server.js` - Node.js 서버용 분석 엔진

## 사용법

### 브라우저 (docs/index.html에서 사용)
```javascript
window.runEduMission(context);
```

### Node.js (서버/CI에서 사용)
```bash
node engine/edumission_server.js
```

## 데이터 파이프라인

1. `raw/*.csv` 파일 변경 감지
2. 데이터 검증 (`data_validation.yml`)
3. 리포트 생성 (`generate_report.yml`)
4. `outputs/*` 파일 자동 업데이트
