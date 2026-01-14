import React, { useEffect , useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {OrbitControls,  useAnimations,useGLTF,useTexture,} from "@react-three/drei";
import { color, texture } from "three/tsl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const Dog = () => {

gsap.registerPlugin(useGSAP())
gsap.registerPlugin(ScrollTrigger)


const model = useGLTF("/models/dog.drc.glb");
// ------------------------------------------------

useThree(({ camera, scene, gl }) => {
  camera.position.z = 0.5;
  gl.toneMapping = THREE.ReinhardToneMapping;
  gl.outputColorSpace = THREE.SRGBColorSpace;
});

const { actions } = useAnimations(model.animations, model.scene);

useEffect(() => {
  actions["Take 001"].play();
}, [actions]);


const [normalMap, sampleMatCap, branchMap, branchNormalMap] = useTexture([
  "/models/dog_normals.jpg",
  "/matcap/mat-2.png",
  "/models/branches_diffuse.jpg",
  "/models/branches_normals.jpg",
]).map((texture) => {
  (texture.flipY = false), (texture.colorSpace = THREE.SRGBColorSpace);
  return texture;
});

const [
  mat1,
  mat2,
  mat3,
  mat4,
  mat5,
  mat6,
  mat7,
  mat8,
  mat9,
  mat10,
  mat11,
  mat12,
  mat13,
  mat14,
  mat15,
  mat16,
  mat17,
  mat18,
  mat19,
  mat20,
] = (useTexture([
  "/matcap/mat-1.png",
  "/matcap/mat-2.png",
  "/matcap/mat-3.png",
  "/matcap/mat-4.png",
  "/matcap/mat-5.png",
  "/matcap/mat-6.png",
  "/matcap/mat-7.png",
  "/matcap/mat-8.png",
  "/matcap/mat-9.png",
  "/matcap/mat-10.png",
  "/matcap/mat-11.png",
  "/matcap/mat-12.png",
  "/matcap/mat-13.png",
  "/matcap/mat-14.png",
  "/matcap/mat-15.png",
  "/matcap/mat-16.png",
  "/matcap/mat-17.png",
  "/matcap/mat-18.png",
  "/matcap/mat-19.png",
  "/matcap/mat-20.png"
  // "/matcap/mat-1.png",
])).map(texture => {
  texture.colorSpace = THREE.SRGBColorSpace
  return texture 
})

const material = useRef({
  uMatcap1:{value : mat19 },
  uMatcap2:{value : mat2 }, 
  uProgress:{value : 1.0 }
})

const dogmaterial = new THREE.MeshMatcapMaterial({
  normalMap: normalMap,
  // color : 0xFF0000,
  matcap: sampleMatCap,
});


const branchMaterial = new THREE.MeshMatcapMaterial({
  normalMap: branchNormalMap,
  map: branchMap,
});


// const textures = useTexture({
  //   normalMap:"/models/dog_normals.jpg",
  //   sampleMatCap:"/matcap/mat-2.png"
  // })
  
  function onBeforeCompile(shader) {
    shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
    shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
    shader.uniforms.uProgress = material.current.uProgress
    
    // Store reference to shader uniforms for GSAP animation
    
    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
      uniform sampler2D uMatcapTexture1;
      uniform sampler2D uMatcapTexture2;
      uniform float uProgress;
      
      void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
      )
    }
  
    dogmaterial.onBeforeCompile = onBeforeCompile

    // textures.normalMap.flipY = false
    // textures.sampleMatCap.colorSpace = THREE.SRGBColorSpace
    
    model.scene.traverse((child) => {
      if (child.name.includes("DOG")) {
        // console.log(child.name)
      child.material = dogmaterial;
    } else {
      child.material = branchMaterial;
    }
  });
  
  const dogModel = useRef(model) 
  
  useGSAP(() => {
    
    const tl = gsap.timeline({
      scrollTrigger : {
        trigger : "section-1",
        endtrigger : "section-2",
        start: "top top",
        end: "bottom bottom",
        markers: true ,
        scrub: true
      }
    })
    
    console.log("hello there")

    tl
    .to(dogModel.current.scene.position , {
      z: "-=0.75",
      y: "+=0.1"
    })
    .to(dogModel.current.scene.rotation , {
      // y : "+=0.1",
      x: "+=0.2"

    })
    .to(dogModel.current.scene.rotation , {
      y: "-=2.8"
      ,
      x:"+=0.06"

      // z: "-=1"
    },"third")
    .to(dogModel.current.scene.position , {
      x: "-=0.46",
      z: "+=0.46",
      y: "+=0.02"
    } , "third")
    

  }, [])

  useEffect(()=> {
    document.querySelector(`.title[img-title="tomorowland"]`).addEventListener("mouseenter", ()=> {
      material.current.uMatcap1.value = mat19 ;
      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="navy-pier"]`).addEventListener("mouseenter", ()=> {

      material.current.uMatcap1.value = mat8 ;

      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="phone"]`).addEventListener("mouseenter", ()=> {
      material.current.uMatcap1.value = mat12 ;

      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="msi-chicago"]`).addEventListener("mouseenter", ()=> {

      material.current.uMatcap1.value = mat9 ;

      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="kikk"]`).addEventListener("mouseenter", ()=> {
      material.current.uMatcap1.value = mat10 ;
      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="kennedy"]`).addEventListener("mouseenter", ()=> {
      material.current.uMatcap1.value = mat8 ;
      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 0.0
        }
      })
    })
    document.querySelector(`.title[img-title="opera"]`).addEventListener("mouseenter", ()=> {
      material.current.uMatcap1.value = mat13 ;
      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })
    })

    document.querySelector(`.titles`).addEventListener("mouseleave", ()=> {

       material.current.uMatcap1.value = mat2 ;
      gsap.to(material.current.uProgress, {
        value : 0.0 ,
        duration: 0.5,
        onComplete:() => {
          material.current.uMatcap2.value =material.current.uMatcap1.value
          material.current.uProgress.value = 1.0
        }
      })

    })

  },[])

  // useGSAP(() => {

  //   const tl = gsap.timeline({
  //     scrollTrigger : {
  //       trigger : "#section-2",
  //       endtrigger : "#section-4",
  //       start: "top top",
  //       end: "bottom bottom",
  //      markers: true ,
  //     scrub: true
  //     }
  //   })

  //   tl
  //   .to(dogModel.current.scene.rotation , {
  //     y: "-=1"

  //   })
  //   .to(dogModel.current.scene.rotation , {
  //     x: "+=0.7"
  //   })
  // }
  // ,[] )








  // ------------------------------------------------

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.16, -0.58, 0.05]}
        rotation={[0.04, Math.PI /5.5, -0.04]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
