# Verification vs Validation (V&V)

> **한 줄**: Verification = **올바르게 만들었는가** (프로세스 검증) / Validation = **올바른 것을 만들었는가** (제품 검증).

> **외우는 팁**: **V**erification은 V의 왼쪽(개발 단계 검증) / **V**alidation은 V의 오른쪽 끝(완성품 확인)

## 핵심 비교

| 구분 | Verification (검증) | Validation (확인) |
|---|---|---|
| 한 줄 질문 | "Are we building the product **right**?" | "Are we building the **right** product?" |
| 대상 | 프로세스 / 중간 산출물 | 완성된 시스템 |
| 시점 | 개발 단계마다 (요구분석·설계·구현) | 개발 완료 후 (시스템·인수 단계) |
| 방식 | 정적 (Static) | 동적 (Dynamic) |
| 활동 예 | 코드 리뷰, 인스펙션, 워크스루, 설계 분석, 단위 테스트 | 시스템 테스트, 인수 테스트, 사용자 시나리오 |
| 주체 | 개발자 / QA 내부 | 사용자 / PO / 비즈니스 |
| 판단 기준 | 명세 / 요구사항 일치 | 사용자 목적 / 유스케이스 달성 |

## V-Model 매핑
- **왼쪽 (요구분석 → 설계 → 구현)** = Verification 영역
- **오른쪽 (단위 → 통합 → 시스템 → 인수)** = Validation 영역 (단위·통합은 Verification 성격도 섞임)
- 상세는 [v-model](../v-model/README.md)

## 자주 헷갈리는 포인트
- **Figma 디자인 기준으로 UI 구현 일치 확인**: 명세 일치 점검이므로 **Verification**
- **실제 사용자가 원하는 흐름인지 확인**: 비즈니스 목적 달성 점검이므로 **Validation**
- 같은 시스템 테스트라도 "명세 일치 확인"이면 Verification, "사용자 목적 달성"이면 Validation
- 단위 / 통합 테스트는 보통 Verification, 인수 테스트는 명확히 Validation

## 본인 프로젝트 매핑 슬롯
- **Verification 예시**: 명세 / 디자인 / 코드 기준의 일치 점검 활동을 골라 설명
- **Validation 예시**: 실제 사용자 흐름 / 비즈니스 목적 달성 확인 활동을 골라 설명

## 면접 답변 템플릿 (30초)
> "Verification은 'Are we building the product right?' 즉 명세대로 올바르게 만들고 있는가를 개발 단계마다 점검하는 활동입니다. 코드 리뷰, 설계 검토, 단위 테스트가 해당합니다. Validation은 'Are we building the right product?' 즉 완성된 시스템이 사용자 관점에서 의도한 목적을 달성하는가를 확인하는 활동이며 시스템 테스트, 인수 테스트가 해당합니다. V-Model 기준으로 왼쪽이 Verification, 오른쪽이 Validation입니다."

## 관련 개념
- [V-Model](../v-model/README.md) — V&V의 단계별 매핑 다이어그램
- [SDLC](../sdlc/README.md) — 어느 단계에서 무엇을 검증하는가
- [테스트 레벨](../test-levels/README.md) — Validation의 4단계 분류
- [테스트 프로세스](../test-process/README.md) — V&V를 어떻게 절차화하는가
