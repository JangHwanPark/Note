## useStepValidate 훅 생성
스터디룸 생성 기능을 맡았을 때, 가장 먼저 부딪힌 구조적 문제는 다단계 폼(Multi-Step Form) 관리였다.
사용자가 모든 단계(필수 입력 인풋 필드)를 완전히 작성해야만 다음 버튼을 누를 수 있어야 했다.
즉, 현재 단계의 모든 필수 필드가 유효한가? 라는 Boolean 값이 필요했고, 이 값으로 다음 단계 이동 여부를 제어할 필요가 있었다.

<br/>

## [초기 구현 코드] useWatch와 수동 trigger의 결합
처음 접근은 단순했습니다. 
`값이 바뀌면 검증을 실행한다`라는 직관적 규칙을 그대로 코드로 옮겼다.

```tsx
export const useStepValidate = (methods: UseFormReturn<StudyRoomFormValues>, step: Step) => {
 const names = fieldsPerStep[step];
 const values = methods.watch(names); // 1. 값의 변화 감지
 const [valid, setValid] = React.useState(false); // 2. 별도 상태 관리
 
 React.useEffect(() => {
  const check = async () => {
   const ok = await methods.trigger(names); // 3. 값이 바뀔 때마다 비동기 검사 실행
   setValid(ok);
  };
  check();
 }, [values, step]); // 4. values를 의존성에 넣어 강제 리렌더링 및 실행
 
 return valid;
};
```
초기 구현은 단순히 watch를 통해 값을 구독하고 값이 변할 때마다 trigger를 호출하여 유효성을 검사하는 방식이었다. 그러나 이 접근에는 여러 가지 문제가 있었다.

먼저, watch는 값이 조금이라도 변하면 해당 훅이 강제로 리렌더링되도록 만든다. 이 말은 사용자가 입력할 때마다 불필요한 렌더링이 계속 발생한다는 의미다. 또한 값이 바뀔 때마다 trigger가 실행되기 때문에 검증 로직이 과도하게 호출된다. 검증은 상대적으로 비용이 큰 작업이므로, 이런 방식은 성능 저하로 이어질 수밖에 없다.

여기에 더해, 유효성 결과를 useState로 별도로 관리해야 했다. 검증을 통해 얻은 결과를 상태에 다시 저장하고, 그 상태를 기반으로 로직을 제어하는 구조였는데, 이 과정에서 동기화 비용이 늘어나고 코드 복잡성도 함께 증가했다.

결국 이 방식은 입력에 민감하게 반응하며 리렌더링이 과도하게 발생하고, 검증 호출이 불필요하게 반복되며, 추가적인 상태 관리까지 필요해져 성능과 유지보수성 양쪽 모두에 불리한 구조라는 결론에 도달했다.

<br/>

## [리팩토링] useFormState(RHF) 활용하여 개선
React Hook Form은 useFormState라는 훅을 제공한다.
이 훅을 사용하면 필드 값 자체가 아니라 검증 상태만 구독할 수 있다.
나는 이 점에 주목했다. 값 변화는 굳이 알 필요가 없고, 내가 궁금한 것은 “해당 단계가 유효한지 여부”였기 때문이다.

또한 useState로 별도 valid 상태를 동기화할 필요도 없다. getFieldState를 호출하면 언제든 필드별 상태를 확인할 수 있기 때문이다.
다만 RHF는 초기 렌더링 시 에러 객체를 만들지 않는다. 그래서 스텝에 진입할 때만 trigger를 한 번 호출해 에러 객체를 미리 생성하도록 했다.

```tsx
export const useStepValidate = (
  methods: UseFormReturn<StudyRoomFormValues>,
  step: Step
) => {
  const names = fieldsPerStep[step];
  const formState = useFormState({
    control: methods.control,
    name: names,
  });
  
  React.useEffect(() => {
    void methods.trigger(fieldsPerStep[step], { shouldFocus: false });
  }, [step, methods]);

  // return React.useMemo(() => {
  //   return names.every((n) => {
  //     const { invalid } = methods.getFieldState(n, formState);
  //     return !invalid;
  //   });
  // }, [formState, methods, names]);
  return React.useMemo(() => {
    const result = names.every((n) => {
      const s = methods.getFieldState(n, formState);
      console.log('[validate] name:', n, {
        value: methods.getValues(n),
        invalid: s.invalid,
        error: s.error,
        touched: s.isTouched,
        dirty: s.isDirty,
      });
      return !s.invalid;
    });
    console.log('[validate] formState.errors:', methods.formState.errors);
    console.log('[validate] result:', result);
    return result;
  }, [formState, methods, names]);
};
```