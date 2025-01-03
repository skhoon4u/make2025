# Make2025

Make2025는 사용자들이 더 나은 2025년을 위해 목표를 설정하고 관리할 수 있도록 돕는 웹 애플리케이션입니다. 이 프로젝트는 React 기반 프론트엔드와 Node.js/Express 백엔드로 구성된 풀스택 애플리케이션이며, AWS에 호스팅되고 있습니다.
([English README](./README_EN.md))

---

## 🌐 라이브 데모

배포된 애플리케이션을 여기에서 확인하세요: [Make2025 Live](http://make2025.click)

---

## 📋 주요 기능

- **목표 관리**: 개인 목표를 추가, 업데이트, 관리합니다.
- **키워드 매칭**: 목표에 따라 맞춤형 키워드와 설명을 제공합니다.
- **이메일 알림**: 설정된 목표를 이메일로 발송합니다.
- **반응형 디자인**: 다양한 기기에 최적화된 UI를 제공합니다.

---

## 🛠️ 기술 스택

- **프론트엔드**: React, Axios
- **백엔드**: Node.js, Express
- **데이터베이스**: MongoDB
- **호스팅**:
  - 프론트엔드: AWS S3
  - 백엔드: AWS EC2

---

## 📂 프로젝트 구조

```
make2025/
├── frontend/        # 프론트엔드 소스 코드
│   ├── src/
│   ├── public/
│   ├── package.json
├── backend/         # 백엔드 소스 코드
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
├── .gitignore       # 버전 관리에서 제외할 파일 목록
├── README.md        # 프로젝트 문서
```

---

## 🚀 시작하기

### 필수 조건

- Node.js 설치
- MongoDB 데이터베이스 설정

### 설치 방법

1. 리포지토리를 클론합니다:

   ```bash
   git clone https://github.com/skhoon4u/make2025.git
   cd make2025
   ```

2. 프론트엔드와 백엔드의 의존성을 설치합니다:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. 프론트엔드와 백엔드 디렉토리에 각각 `.env` 파일을 생성합니다.

### 환경 변수 설정

- **프론트엔드**: `frontend` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

  ```plaintext
  REACT_APP_BACKEND_URL=http://localhost:3001/api
  ```

- **백엔드**: `backend` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:
  ```plaintext
  MONGODB_URI=your-mongodb-uri
  OPENAI_API_KEY=your-openai-api-key
  EMAIL_USER="your-outgoing-email-address"
  EMAIL_PASS="your-outgoing-email-password"
  JWT_SECRET=your-secret-key
  ```
  - EMAIL_USER, EMAIL_PASS 의 경우 구글 계정에서 앱 비밀번호(16자리)를 발급받아 사용할 수 있습니다.

### 애플리케이션 실행

1. 백엔드 서버를 시작합니다:

   ```bash
   cd backend
   npm start
   ```

2. 프론트엔드 개발 서버를 시작합니다:
   ```bash
   cd frontend
   npm start
   ```

---

## 📝 사용 방법

1. 라이브 데모 링크를 방문하거나 애플리케이션을 로컬에서 실행하세요.
2. 계정을 생성하고 로그인하세요.
3. 목표를 설정하고 맞춤형 제안과 설명을 받으세요.
4. 목표를 이메일로 전송하세요.

---

## 🤝 기여하기

기여를 환영합니다! 다음 절차를 따라 기여할 수 있습니다:

1. 이 저장소를 포크합니다.
2. 새로운 기능 또는 버그 수정을 위한 브랜치를 생성합니다:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 변경 사항을 커밋합니다:
   ```bash
   git commit -m "Add your feature or fix description"
   ```
4. 브랜치를 푸시합니다:
   ```bash
   git push origin feature/your-feature-name
   ```
5. 풀 리퀘스트를 생성합니다.

---

## 🛡️ 보안

- `.env` 파일은 비공개로 유지하고 버전 관리에 포함하지 마세요.
- 민감한 정보 관리를 위해 환경 변수를 사용하세요.

---

## 📧 문의

질문이나 지원이 필요하시면 이메일로 연락하세요: [skhoon4u@gmail.com].
