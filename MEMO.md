## Hyperledger Caliper?

리눅스재단이 주최하는 하이퍼레저 프로젝트 중 하나로, 블록체인의 성능을 테스트하기 위한 벤치마크 도구.

하이퍼레저 캘리퍼는 사용자가 미리 정의된 유스케이스 세트를 사용하여 특정 블록체인 구현의 성능을 측정할 수 있도록 한다. 하이퍼레저에서 제공하는 [성능 측정 지표](https://www.notion.so/67120062244e4c4781b4f38af54341a2)에 따라 보고서를 작성한다.

## 도입 이유

기존 성능 평가 방법은 직접 쿼리를 실행하고 실행 시간을 측정하는 방법을 사용했는데, 쿼리 수가 많아지면 매우 오랜 시간이 소요될 뿐만 아니라 기기 성능 등 측정을 방해하는 다양한 요소들이 존재하기 때문에 의미 있는 결과를 얻기에 비효율적이라 판단했다. 따라서 Hyperledger caliper를 이용하는 방법으로 변경하였다.

## 환경 설정

기본적으로 아래 Docs를 참고해서 작업했다.

[Installing and Running Caliper](https://hyperledger.github.io/caliper/v0.4.2/installing-caliper/)

### Pre-requisites

**node-gyp / python2 / make / g++ / git**
본인의 경우 이미 설치되어 있어서 node-gyp만 추가로 설치했음.

**Node.js v8.X LTS or v10.X LTS (Caliper 실행을 위함)**
본인의 경우 v10 LTS 사용

**Docker / Docker Compose**
로컬 실행 예제나, Docker image를 이용한 Caliper 실행 시 필요.

### git repository(caliper-benchmark) clone 및 버전 설정

```bash
$ git clone https://github.com/hyperledger/caliper-benchmarks.git
$ cd caliper-benchmarks
$ git checkout tags/v0.4.0 -b v0.4.0
```

caliper v0.4.0 사용하였음.

### Network 설정 파일 generate

**networks/fabric/*** 경로에서 사용하려는 네트워크 설정 디렉토리로 접근한 뒤 **[generate.sh](http://generate.sh)** 파일을 실행함으로써 네트워크 설정 파일을 생성한다.

```bash
~/caliper-benchmarks/networks/fabric/config_solo_raft$ ./generate.sh
```

### Local NPM을 이용한 설치 및 실행

```bash
$ npm init -y
$ npm install --only=prod @hyperledger/caliper-cli@0.4.0
$ npx caliper bind --caliper-bind-sut fabric:1.4
$ npx caliper launch manager \
	--caliper-workspace . \
	--caliper-benchconfig benchmarks/scenario/simple/config.yaml \
	--caliper-networkconfig networks/fabric/v1/v1.4.1/2org1peercouchdb_raft/fabric-go-tls-solo.yaml
```

정상적으로 수행되면 설정 파일에 따라 네트워크가 구성되고 테스트를 진행한다.

이 경우 hyperledger fabric v1.4.1 버전, 2개의 Org, 각 1개 Peer, CouchDB를 사용하는 네트워크를 구성했다.

### Issue

```bash
error [caliper] [caliper-engine] Error while performing "install" step: Error: Invalid endorsement for marbles@v0 in mychannel from peer0.org1.example.com: error starting container: error starting container: API error (404): network 2org1peercouchdb_solo_raft_default not found
```

채널에 체인코드 instantiate 중 문제 발생.
로그를 살펴보면 **2org1peercouchdb_solo_raft_default** 라는 이름의 네트워크를 찾지 못하고 있다.

좀 더 위쪽을 찾아보면

```bash
Creating network "2org1peercouchdbsoloraft_default" with the default driver
```

위 로그를 볼 수 있는데, 보통 docker-compose를 이용해서 Docker 네트워크를 구성하면 docker-compose 파일이 있는 디렉토리 이름 뒤에 **_default** 를 붙여 Docker 네트워크 이름으로 사용한다. 

[Local NPM을 이용한 설치 및 실행](https://www.notion.so/67120062244e4c4781b4f38af54341a2)에서 사용한 코드에서 참조하는 docker-compose 파일은 **2org1peercouchdb_solo_raft** 디렉토리 아래에 있기 때문에 Docker 네트워크 이름이 **2org1peercouchdb_solo_raft_default** 가 되어야 하는데 어떻게 된건지 Underscore(_)가 생략되었다.

**networks/fabric/docker-compose/2org1peercouchdb_solo_raft** 중 두 개의 peer 컨테이너 설정에

```yaml
CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=2org1peercouchdb_solo_raft_default
```

부분이 있는데, Docker compose 문제를 당장 해결하기는 어려우니

```yaml
CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=2org1peercouchdbsoloraft_default
```

위와 같이 변경해준다.

이후 실행하면 해결.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/44cd66cc-a10f-4df3-97be-1dbe69b1368c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/44cd66cc-a10f-4df3-97be-1dbe69b1368c/Untitled.png)