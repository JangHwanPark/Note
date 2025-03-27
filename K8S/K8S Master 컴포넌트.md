## Master(Control Plane) Component에 대한 설명으로 틀린것은?
- K8S에서 필요한 모든 데이터를 저장하는 데이타베이스 역할
- kube-apiserver - 클러스터로 온 요청이 유효한지 검사한다.
- kube-scheduler : 클러스터 안 모든 노드에서 실행되는 k8s agent이다.
- kube-controller-manager : Pod를 관찰하며 개수를 보장한다.

정답 3번
- kube-scheduler : 클러스터 안 모든 노드에서 실행되는 k8s agent이다.

해설
- kube-scheduler는 Control Plane의 컴포넌트로, 새롭게 생성된 Pod를 어떤 Node에 배치할지 결정하는 역할을 합니다.
- "모든 노드에서 실행되는 agent"는 kubelet에 대한 설명입니다.


| 보기                   | 설명                                      | 올바른 여부 |
|------------------------|-------------------------------------------|-------------|
| etcd                  | K8S에서 필요한 모든 데이터를 저장하는 분산 키-값 저장소 | O           |
| kube-apiserver        | 클러스터로 들어오는 요청의 유효성 검사, 인증, 인가 처리 | O           |
| kube-scheduler        | Pod를 어떤 노드에 배치할지 결정하는 스케줄러          | X           |
| kube-controller-manager | 컨트롤러를 통해 Pod 개수 유지, 상태 관리 등을 수행  | O           |


## 다음 중 worker node component가 아닌것은?
- kubelet
- Kube-proxy
- Container runtime
- Cloud-controller-manager

정답은 4번
- Cloud-controller-manager

해설
- Cloud-controller-manager는 Control Plane 구성 요소로, Kubernetes를 클라우드 서비스(AWS, GCP 등)의 리소스와 연동하는 역할을 합니다. 
- 예: LoadBalancer 생성, 노드 상태 확인 등 클라우드 종속 기능 수행.



| 보기                   | 컴포넌트              | 설명                              |
|------------------------|-----------------------|-----------------------------------|
| 1) kubelet            | ✅ Worker Node        | Node에서 Pod를 실행하고 상태를 관리함 |
| 2) kube-proxy         | ✅ Worker Node        | 서비스와 네트워크 트래픽 라우팅 처리   |
| 3) Container runtime  | ✅ Worker Node        | 컨테이너 실행 (예: Docker, containerd) |
| 4) Cloud-controller-manager | ❌ Control Plane | 클라우드 API와 연동 (노드, LB 등 관리) |