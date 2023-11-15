import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Test() {
  const [scene, setScene] = useState<any>(new THREE.Scene());
  const [camera, setCamera] = useState<any>(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    //(fov, aspect ratio, far, near)

    //fov: field of view. 75도. 디스플레이에 표시되는 범위
    //aspect ratio: window의 width/height가 일반적. 비율인듯?
    //far, near: 이 범위 밖의 물체는 렌더링되지 않음
  );
  const [renderer, setRenderer] = useState<any>(new THREE.WebGLRenderer());
  const mount = useRef<HTMLDivElement | null>(null);

  function animate(cube: any) {
    if (renderer) {
      //렌더링.
      //setinterval대신 requestAnimationFrame를 쓰자.
      //그건 사용자가 다른 브라우저 탭으로 이동할 때 자동으로 일시 정지된다.
      requestAnimationFrame(() => animate(cube));

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
  }

  useEffect(() => {
    if (mount.current) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      //렌더링 크기. 값이 작을수록 고성능이 필요하다.
      //렌더링 크기를 유지하되 더 낮은 해상도로 렌더링하려면 뒤에 false(updateStyle)를 붙여주자.

      if (!mount.current.querySelector("canvas"))
        mount.current.appendChild(renderer.domElement);
    }
    return () => {
      // 컴포넌트가 언마운트될 때 Three.js 리소스 정리
      if (renderer) renderer.dispose();
    };
  }, [mount]);

  return (
    <div ref={mount}>
      <button
        onClick={() => {
          //1.모양을 정하고
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          //2.구체적인 색, 재질 등을 정하고
          const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          //3.합쳐서 큐브를 만든다.
          const cube = new THREE.Mesh(geometry, material);
          //mesh: scene에 삽입할 수 있는 개체.

          scene.add(cube);
          //기본적으로 0,0,0에 추가된다

          camera.position.z = 5;

          animate(cube);
        }}
      >
        사각형 추가
      </button>
      <button
        onClick={() => {
          camera.position.set(0, 0, 100);
          camera.lookAt(0, 0, 0);
          const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
          const points = [];
          points.push(new THREE.Vector3(-10, 0, 0));
          points.push(new THREE.Vector3(0, 10, 0));
          points.push(new THREE.Vector3(10, 0, 0));

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, material);

          scene.add(line);
          renderer.render(scene, camera);
        }}
      >
        선 추가
      </button>
    </div>
  );
}
