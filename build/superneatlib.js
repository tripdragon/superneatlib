import { Matrix4, TrianglesDrawMode, TriangleFanDrawMode, TriangleStripDrawMode, Loader, LoaderUtils, FileLoader, Color, SpotLight, PointLight, DirectionalLight, MeshBasicMaterial, SRGBColorSpace, MeshPhysicalMaterial, Vector2, Vector3, Quaternion, InstancedMesh, Object3D, TextureLoader, ImageBitmapLoader, BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, PointsMaterial, Material, LineBasicMaterial, MeshStandardMaterial, DoubleSide, PropertyBinding, BufferGeometry, SkinnedMesh, Mesh, LineSegments, Line, LineLoop, Points, Group, PerspectiveCamera, MathUtils, OrthographicCamera, Skeleton, InterpolateLinear, AnimationClip, Bone, NearestFilter, NearestMipmapNearestFilter, LinearMipmapNearestFilter, NearestMipmapLinearFilter, ClampToEdgeWrapping, MirroredRepeatWrapping, InterpolateDiscrete, FrontSide, Texture, VectorKeyframeTrack, QuaternionKeyframeTrack, NumberKeyframeTrack, Box3, Sphere, Interpolant, Clock, Raycaster, Plane, EventDispatcher, PlaneHelper, SphereGeometry, LineCurve3, TubeGeometry, HemisphereLight, HemisphereLightHelper, LightProbe, WebGLCubeRenderTarget, WebGLRenderer, PCFSoftShadowMap, Scene, MOUSE, TOUCH, Spherical, GridHelper, PlaneGeometry, ShadowMaterial, AnimationMixer } from 'three';

const REVISION = 1;

function foof() {
  console.log("in foof 555bbb");
}


function narf() {
  console.log("in narf 3333bbb");
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}


// gives a val in neg or pos of val
// export function randomBetweenMirror(val) {
//   const min = -val;
//   const max = val;
//   return (Math.random() * (max - min) + min);
// }

// of 5 get -5 ... 5
// BUT youll never get -5,5 cause random dont work like that!!
function randomBetweenNegPos(val) {
  const a = randomBetween(-val, val);
  const min = -val;
  const max = val;
  return (Math.random() * (max - min) + min) * a;
}

var utilites = /*#__PURE__*/Object.freeze({
  __proto__: null,
  randomBetween: randomBetween,
  randomBetweenNegPos: randomBetweenNegPos
});

function spinnerY(speed = randomBetween(-1,1)) {
  this.rotation.y += speed;
}
function spinnerZ(speed = randomBetween(-1,1)) {
  this.rotation.z += speed;
}
function spinnerX(speed = randomBetween(-1,1)) {
  this.rotation.x += speed;
}

var spinners = /*#__PURE__*/Object.freeze({
  __proto__: null,
  spinnerX: spinnerX,
  spinnerY: spinnerY,
  spinnerZ: spinnerZ
});

class DeltaFrame{
  frame = null;
  poseMatrix = new Matrix4();
  reticle = null;
  timestamp = 0;
  
  
  // https://developer.mozilla.org/en-US/docs/Web/API/XRPose
  XRPose = null;
}

// this acts as a scene grapth

// DONT run swap routines in a loop
// need the more complicated for loop walking

class CheapPool extends Array{

  selectedIndex = 0;

  // constructor() {
  //   super();
  // }
  // 0 to length
  add(...item){
    this.push(...item);
  }
  remove(item){
    const index = this.indexOf(item);
    if (index > -1) this.splice(index, 1);
  }
  clear(){
    this.length = 0;
    this.selectedIndex = 0;
  }
//   function removeItemAll(arr, value) {
//   var i = 0;
//   while (i < arr.length) {
//     if (arr[i] === value) {
//       arr.splice(i, 1);
//     } else {
//       ++i;
//     }
//   }
//   return arr;
// }
  // 0 to length
  // [a,b,c] to:
  // [b,c,a]
  swapFront(){
    this.swap("front");
    return this;
  }
  // length to 0
  // [a,b,c] to:
  // [c,a,b]
  swapBack(){
    this.swap("back");
    return this;
  }
  swap(side){
    if(this.length < 1){
      console.log("length must be greater than 1");
      return;
    }
    if(side === "front"){
      const aa = this.shift();
      this.push(aa);
    }
    if(side === "back"){
      const aa = this.pop();
      this.unshift(aa);
    }
  }


}

/**
 * @param {BufferGeometry} geometry
 * @param {number} drawMode
 * @return {BufferGeometry}
 */
function toTrianglesDrawMode( geometry, drawMode ) {

	if ( drawMode === TrianglesDrawMode ) {

		console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
		return geometry;

	}

	if ( drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode ) {

		let index = geometry.getIndex();

		// generate index if not present

		if ( index === null ) {

			const indices = [];

			const position = geometry.getAttribute( 'position' );

			if ( position !== undefined ) {

				for ( let i = 0; i < position.count; i ++ ) {

					indices.push( i );

				}

				geometry.setIndex( indices );
				index = geometry.getIndex();

			} else {

				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
				return geometry;

			}

		}

		//

		const numberOfTriangles = index.count - 2;
		const newIndices = [];

		if ( drawMode === TriangleFanDrawMode ) {

			// gl.TRIANGLE_FAN

			for ( let i = 1; i <= numberOfTriangles; i ++ ) {

				newIndices.push( index.getX( 0 ) );
				newIndices.push( index.getX( i ) );
				newIndices.push( index.getX( i + 1 ) );

			}

		} else {

			// gl.TRIANGLE_STRIP

			for ( let i = 0; i < numberOfTriangles; i ++ ) {

				if ( i % 2 === 0 ) {

					newIndices.push( index.getX( i ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i + 2 ) );

				} else {

					newIndices.push( index.getX( i + 2 ) );
					newIndices.push( index.getX( i + 1 ) );
					newIndices.push( index.getX( i ) );

				}

			}

		}

		if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

		}

		// build final geometry

		const newGeometry = geometry.clone();
		newGeometry.setIndex( newIndices );
		newGeometry.clearGroups();

		return newGeometry;

	} else {

		console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
		return geometry;

	}

}

class GLTFLoader extends Loader {

	constructor( manager ) {

		super( manager );

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register( function ( parser ) {

			return new GLTFMaterialsClearcoatExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureBasisUExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureWebPExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFTextureAVIFExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSheenExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsTransmissionExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsVolumeExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIorExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsEmissiveStrengthExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsSpecularExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsIridescenceExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMaterialsAnisotropyExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFLightsExtension( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshoptCompression( parser );

		} );

		this.register( function ( parser ) {

			return new GLTFMeshGpuInstancing( parser );

		} );

	}

	load( url, onLoad, onProgress, onError ) {

		const scope = this;

		let resourcePath;

		if ( this.resourcePath !== '' ) {

			resourcePath = this.resourcePath;

		} else if ( this.path !== '' ) {

			resourcePath = this.path;

		} else {

			resourcePath = LoaderUtils.extractUrlBase( url );

		}

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		this.manager.itemStart( url );

		const _onError = function ( e ) {

			if ( onError ) {

				onError( e );

			} else {

				console.error( e );

			}

			scope.manager.itemError( url );
			scope.manager.itemEnd( url );

		};

		const loader = new FileLoader( this.manager );

		loader.setPath( this.path );
		loader.setResponseType( 'arraybuffer' );
		loader.setRequestHeader( this.requestHeader );
		loader.setWithCredentials( this.withCredentials );

		loader.load( url, function ( data ) {

			try {

				scope.parse( data, resourcePath, function ( gltf ) {

					onLoad( gltf );

					scope.manager.itemEnd( url );

				}, _onError );

			} catch ( e ) {

				_onError( e );

			}

		}, onProgress, _onError );

	}

	setDRACOLoader( dracoLoader ) {

		this.dracoLoader = dracoLoader;
		return this;

	}

	setDDSLoader() {

		throw new Error(

			'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'

		);

	}

	setKTX2Loader( ktx2Loader ) {

		this.ktx2Loader = ktx2Loader;
		return this;

	}

	setMeshoptDecoder( meshoptDecoder ) {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	register( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) === -1 ) {

			this.pluginCallbacks.push( callback );

		}

		return this;

	}

	unregister( callback ) {

		if ( this.pluginCallbacks.indexOf( callback ) !== -1 ) {

			this.pluginCallbacks.splice( this.pluginCallbacks.indexOf( callback ), 1 );

		}

		return this;

	}

	parse( data, path, onLoad, onError ) {

		let json;
		const extensions = {};
		const plugins = {};
		const textDecoder = new TextDecoder();

		if ( typeof data === 'string' ) {

			json = JSON.parse( data );

		} else if ( data instanceof ArrayBuffer ) {

			const magic = textDecoder.decode( new Uint8Array( data, 0, 4 ) );

			if ( magic === BINARY_EXTENSION_HEADER_MAGIC ) {

				try {

					extensions[ EXTENSIONS.KHR_BINARY_GLTF ] = new GLTFBinaryExtension( data );

				} catch ( error ) {

					if ( onError ) onError( error );
					return;

				}

				json = JSON.parse( extensions[ EXTENSIONS.KHR_BINARY_GLTF ].content );

			} else {

				json = JSON.parse( textDecoder.decode( data ) );

			}

		} else {

			json = data;

		}

		if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

			if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
			return;

		}

		const parser = new GLTFParser( json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder

		} );

		parser.fileLoader.setRequestHeader( this.requestHeader );

		for ( let i = 0; i < this.pluginCallbacks.length; i ++ ) {

			const plugin = this.pluginCallbacks[ i ]( parser );
			plugins[ plugin.name ] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[ plugin.name ] = true;

		}

		if ( json.extensionsUsed ) {

			for ( let i = 0; i < json.extensionsUsed.length; ++ i ) {

				const extensionName = json.extensionsUsed[ i ];
				const extensionsRequired = json.extensionsRequired || [];

				switch ( extensionName ) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[ extensionName ] = new GLTFMaterialsUnlitExtension();
						break;

					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
						extensions[ extensionName ] = new GLTFDracoMeshCompressionExtension( json, this.dracoLoader );
						break;

					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
						extensions[ extensionName ] = new GLTFTextureTransformExtension();
						break;

					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[ extensionName ] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if ( extensionsRequired.indexOf( extensionName ) >= 0 && plugins[ extensionName ] === undefined ) {

							console.warn( 'THREE.GLTFLoader: Unknown extension "' + extensionName + '".' );

						}

				}

			}

		}

		parser.setExtensions( extensions );
		parser.setPlugins( plugins );
		parser.parse( onLoad, onError );

	}

	parseAsync( data, path ) {

		const scope = this;

		return new Promise( function ( resolve, reject ) {

			scope.parse( data, path, resolve, reject );

		} );

	}

}

/* GLTFREGISTRY */

function GLTFRegistry() {

	let objects = {};

	return	{

		get: function ( key ) {

			return objects[ key ];

		},

		add: function ( key, object ) {

			objects[ key ] = object;

		},

		remove: function ( key ) {

			delete objects[ key ];

		},

		removeAll: function () {

			objects = {};

		}

	};

}

/*********************************/
/********** EXTENSIONS ***********/
/*********************************/

const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
	KHR_MATERIALS_IOR: 'KHR_materials_ior',
	KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
	KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
	KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
	KHR_MATERIALS_ANISOTROPY: 'KHR_materials_anisotropy',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
	KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
	EXT_TEXTURE_AVIF: 'EXT_texture_avif',
	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
	EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing'
};

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
class GLTFLightsExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	_markDefs() {

		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];

		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.extensions
					&& nodeDef.extensions[ this.name ]
					&& nodeDef.extensions[ this.name ].light !== undefined ) {

				parser._addNodeRef( this.cache, nodeDef.extensions[ this.name ].light );

			}

		}

	}

	_loadLight( lightIndex ) {

		const parser = this.parser;
		const cacheKey = 'light:' + lightIndex;
		let dependency = parser.cache.get( cacheKey );

		if ( dependency ) return dependency;

		const json = parser.json;
		const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
		const lightDefs = extensions.lights || [];
		const lightDef = lightDefs[ lightIndex ];
		let lightNode;

		const color = new Color( 0xffffff );

		if ( lightDef.color !== undefined ) color.fromArray( lightDef.color );

		const range = lightDef.range !== undefined ? lightDef.range : 0;

		switch ( lightDef.type ) {

			case 'directional':
				lightNode = new DirectionalLight( color );
				lightNode.target.position.set( 0, 0, -1 );
				lightNode.add( lightNode.target );
				break;

			case 'point':
				lightNode = new PointLight( color );
				lightNode.distance = range;
				break;

			case 'spot':
				lightNode = new SpotLight( color );
				lightNode.distance = range;
				// Handle spotlight properties.
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set( 0, 0, -1 );
				lightNode.add( lightNode.target );
				break;

			default:
				throw new Error( 'THREE.GLTFLoader: Unexpected light type: ' + lightDef.type );

		}

		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
		// here, because node-level parsing will only override position if explicitly specified.
		lightNode.position.set( 0, 0, 0 );

		lightNode.decay = 2;

		assignExtrasToUserData( lightNode, lightDef );

		if ( lightDef.intensity !== undefined ) lightNode.intensity = lightDef.intensity;

		lightNode.name = parser.createUniqueName( lightDef.name || ( 'light_' + lightIndex ) );

		dependency = Promise.resolve( lightNode );

		parser.cache.add( cacheKey, dependency );

		return dependency;

	}

	getDependency( type, index ) {

		if ( type !== 'light' ) return;

		return this._loadLight( index );

	}

	createNodeAttachment( nodeIndex ) {

		const self = this;
		const parser = this.parser;
		const json = parser.json;
		const nodeDef = json.nodes[ nodeIndex ];
		const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
		const lightIndex = lightDef.light;

		if ( lightIndex === undefined ) return null;

		return this._loadLight( lightIndex ).then( function ( light ) {

			return parser._getNodeRef( self.cache, lightIndex, light );

		} );

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
class GLTFMaterialsUnlitExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	getMaterialType() {

		return MeshBasicMaterial;

	}

	extendParams( materialParams, materialDef, parser ) {

		const pending = [];

		materialParams.color = new Color( 1.0, 1.0, 1.0 );
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if ( metallicRoughness ) {

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray( array );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 */
class GLTFMaterialsEmissiveStrengthExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const emissiveStrength = materialDef.extensions[ this.name ].emissiveStrength;

		if ( emissiveStrength !== undefined ) {

			materialParams.emissiveIntensity = emissiveStrength;

		}

		return Promise.resolve();

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
class GLTFMaterialsClearcoatExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.clearcoatFactor !== undefined ) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if ( extension.clearcoatTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatMap', extension.clearcoatTexture ) );

		}

		if ( extension.clearcoatRoughnessFactor !== undefined ) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if ( extension.clearcoatRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture ) );

		}

		if ( extension.clearcoatNormalTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture ) );

			if ( extension.clearcoatNormalTexture.scale !== undefined ) {

				const scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new Vector2( scale, scale );

			}

		}

		return Promise.all( pending );

	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 */
class GLTFMaterialsIridescenceExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.iridescenceFactor !== undefined ) {

			materialParams.iridescence = extension.iridescenceFactor;

		}

		if ( extension.iridescenceTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceMap', extension.iridescenceTexture ) );

		}

		if ( extension.iridescenceIor !== undefined ) {

			materialParams.iridescenceIOR = extension.iridescenceIor;

		}

		if ( materialParams.iridescenceThicknessRange === undefined ) {

			materialParams.iridescenceThicknessRange = [ 100, 400 ];

		}

		if ( extension.iridescenceThicknessMinimum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 0 ] = extension.iridescenceThicknessMinimum;

		}

		if ( extension.iridescenceThicknessMaximum !== undefined ) {

			materialParams.iridescenceThicknessRange[ 1 ] = extension.iridescenceThicknessMaximum;

		}

		if ( extension.iridescenceThicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'iridescenceThicknessMap', extension.iridescenceThicknessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 */
class GLTFMaterialsSheenExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		materialParams.sheenColor = new Color( 0, 0, 0 );
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;

		const extension = materialDef.extensions[ this.name ];

		if ( extension.sheenColorFactor !== undefined ) {

			materialParams.sheenColor.fromArray( extension.sheenColorFactor );

		}

		if ( extension.sheenRoughnessFactor !== undefined ) {

			materialParams.sheenRoughness = extension.sheenRoughnessFactor;

		}

		if ( extension.sheenColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenColorMap', extension.sheenColorTexture, SRGBColorSpace ) );

		}

		if ( extension.sheenRoughnessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 */
class GLTFMaterialsTransmissionExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.transmissionFactor !== undefined ) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if ( extension.transmissionTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'transmissionMap', extension.transmissionTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 */
class GLTFMaterialsVolumeExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if ( extension.thicknessTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'thicknessMap', extension.thicknessTexture ) );

		}

		materialParams.attenuationDistance = extension.attenuationDistance || Infinity;

		const colorArray = extension.attenuationColor || [ 1, 1, 1 ];
		materialParams.attenuationColor = new Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		return Promise.all( pending );

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 */
class GLTFMaterialsIorExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[ this.name ];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 */
class GLTFMaterialsSpecularExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if ( extension.specularTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularIntensityMap', extension.specularTexture ) );

		}

		const colorArray = extension.specularColorFactor || [ 1, 1, 1 ];
		materialParams.specularColor = new Color( colorArray[ 0 ], colorArray[ 1 ], colorArray[ 2 ] );

		if ( extension.specularColorTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'specularColorMap', extension.specularColorTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending );

	}

}

/**
 * Materials anisotropy Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_anisotropy
 */
class GLTFMaterialsAnisotropyExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;

	}

	getMaterialType( materialIndex ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams( materialIndex, materialParams ) {

		const parser = this.parser;
		const materialDef = parser.json.materials[ materialIndex ];

		if ( ! materialDef.extensions || ! materialDef.extensions[ this.name ] ) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[ this.name ];

		if ( extension.anisotropyStrength !== undefined ) {

			materialParams.anisotropy = extension.anisotropyStrength;

		}

		if ( extension.anisotropyRotation !== undefined ) {

			materialParams.anisotropyRotation = extension.anisotropyRotation;

		}

		if ( extension.anisotropyTexture !== undefined ) {

			pending.push( parser.assignTexture( materialParams, 'anisotropyMap', extension.anisotropyTexture ) );

		}

		return Promise.all( pending );

	}

}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 */
class GLTFTextureBasisUExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	loadTexture( textureIndex ) {

		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ this.name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ this.name ];
		const loader = parser.options.ktx2Loader;

		if ( ! loader ) {

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures' );

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage( textureIndex, extension.source, loader );

	}

}

/**
 * WebP Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
 */
class GLTFTextureWebPExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
		this.isSupported = null;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, extension.source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: WebP required by asset but unsupported.' );

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture( textureIndex );

		} );

	}

	detectSupport() {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				const image = new Image();

				// Lossy test image. Support for lossy images doesn't guarantee support for all
				// WebP images, unfortunately.
				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	}

}

/**
 * AVIF Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
 */
class GLTFTextureAVIFExtension {

	constructor( parser ) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
		this.isSupported = null;

	}

	loadTexture( textureIndex ) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[ textureIndex ];

		if ( ! textureDef.extensions || ! textureDef.extensions[ name ] ) {

			return null;

		}

		const extension = textureDef.extensions[ name ];
		const source = json.images[ extension.source ];

		let loader = parser.textureLoader;
		if ( source.uri ) {

			const handler = parser.options.manager.getHandler( source.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.detectSupport().then( function ( isSupported ) {

			if ( isSupported ) return parser.loadTextureImage( textureIndex, extension.source, loader );

			if ( json.extensionsRequired && json.extensionsRequired.indexOf( name ) >= 0 ) {

				throw new Error( 'THREE.GLTFLoader: AVIF required by asset but unsupported.' );

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture( textureIndex );

		} );

	}

	detectSupport() {

		if ( ! this.isSupported ) {

			this.isSupported = new Promise( function ( resolve ) {

				const image = new Image();

				// Lossy test image.
				image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
				image.onload = image.onerror = function () {

					resolve( image.height === 1 );

				};

			} );

		}

		return this.isSupported;

	}

}

/**
 * meshopt BufferView Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
 */
class GLTFMeshoptCompression {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	loadBufferView( index ) {

		const json = this.parser.json;
		const bufferView = json.bufferViews[ index ];

		if ( bufferView.extensions && bufferView.extensions[ this.name ] ) {

			const extensionDef = bufferView.extensions[ this.name ];

			const buffer = this.parser.getDependency( 'buffer', extensionDef.buffer );
			const decoder = this.parser.options.meshoptDecoder;

			if ( ! decoder || ! decoder.supported ) {

				if ( json.extensionsRequired && json.extensionsRequired.indexOf( this.name ) >= 0 ) {

					throw new Error( 'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files' );

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return buffer.then( function ( res ) {

				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;

				const count = extensionDef.count;
				const stride = extensionDef.byteStride;

				const source = new Uint8Array( res, byteOffset, byteLength );

				if ( decoder.decodeGltfBufferAsync ) {

					return decoder.decodeGltfBufferAsync( count, stride, source, extensionDef.mode, extensionDef.filter ).then( function ( res ) {

						return res.buffer;

					} );

				} else {

					// Support for MeshoptDecoder 0.18 or earlier, without decodeGltfBufferAsync
					return decoder.ready.then( function () {

						const result = new ArrayBuffer( count * stride );
						decoder.decodeGltfBuffer( new Uint8Array( result ), count, stride, source, extensionDef.mode, extensionDef.filter );
						return result;

					} );

				}

			} );

		} else {

			return null;

		}

	}

}

/**
 * GPU Instancing Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
 *
 */
class GLTFMeshGpuInstancing {

	constructor( parser ) {

		this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
		this.parser = parser;

	}

	createNodeMesh( nodeIndex ) {

		const json = this.parser.json;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( ! nodeDef.extensions || ! nodeDef.extensions[ this.name ] ||
			nodeDef.mesh === undefined ) {

			return null;

		}

		const meshDef = json.meshes[ nodeDef.mesh ];

		// No Points or Lines + Instancing support yet

		for ( const primitive of meshDef.primitives ) {

			if ( primitive.mode !== WEBGL_CONSTANTS.TRIANGLES &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP &&
				 primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN &&
				 primitive.mode !== undefined ) {

				return null;

			}

		}

		const extensionDef = nodeDef.extensions[ this.name ];
		const attributesDef = extensionDef.attributes;

		// @TODO: Can we support InstancedMesh + SkinnedMesh?

		const pending = [];
		const attributes = {};

		for ( const key in attributesDef ) {

			pending.push( this.parser.getDependency( 'accessor', attributesDef[ key ] ).then( accessor => {

				attributes[ key ] = accessor;
				return attributes[ key ];

			} ) );

		}

		if ( pending.length < 1 ) {

			return null;

		}

		pending.push( this.parser.createNodeMesh( nodeIndex ) );

		return Promise.all( pending ).then( results => {

			const nodeObject = results.pop();
			const meshes = nodeObject.isGroup ? nodeObject.children : [ nodeObject ];
			const count = results[ 0 ].count; // All attribute counts should be same
			const instancedMeshes = [];

			for ( const mesh of meshes ) {

				// Temporal variables
				const m = new Matrix4();
				const p = new Vector3();
				const q = new Quaternion();
				const s = new Vector3( 1, 1, 1 );

				const instancedMesh = new InstancedMesh( mesh.geometry, mesh.material, count );

				for ( let i = 0; i < count; i ++ ) {

					if ( attributes.TRANSLATION ) {

						p.fromBufferAttribute( attributes.TRANSLATION, i );

					}

					if ( attributes.ROTATION ) {

						q.fromBufferAttribute( attributes.ROTATION, i );

					}

					if ( attributes.SCALE ) {

						s.fromBufferAttribute( attributes.SCALE, i );

					}

					instancedMesh.setMatrixAt( i, m.compose( p, q, s ) );

				}

				// Add instance attributes to the geometry, excluding TRS.
				for ( const attributeName in attributes ) {

					if ( attributeName !== 'TRANSLATION' &&
						 attributeName !== 'ROTATION' &&
						 attributeName !== 'SCALE' ) {

						mesh.geometry.setAttribute( attributeName, attributes[ attributeName ] );

					}

				}

				// Just in case
				Object3D.prototype.copy.call( instancedMesh, mesh );

				this.parser.assignFinalMaterial( instancedMesh );

				instancedMeshes.push( instancedMesh );

			}

			if ( nodeObject.isGroup ) {

				nodeObject.clear();

				nodeObject.add( ... instancedMeshes );

				return nodeObject;

			}

			return instancedMeshes[ 0 ];

		} );

	}

}

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

class GLTFBinaryExtension {

	constructor( data ) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );
		const textDecoder = new TextDecoder();

		this.header = {
			magic: textDecoder.decode( new Uint8Array( data.slice( 0, 4 ) ) ),
			version: headerView.getUint32( 4, true ),
			length: headerView.getUint32( 8, true )
		};

		if ( this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC ) {

			throw new Error( 'THREE.GLTFLoader: Unsupported glTF-Binary header.' );

		} else if ( this.header.version < 2.0 ) {

			throw new Error( 'THREE.GLTFLoader: Legacy binary file detected.' );

		}

		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
		let chunkIndex = 0;

		while ( chunkIndex < chunkContentsLength ) {

			const chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			const chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;

			if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

				const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
				this.content = textDecoder.decode( contentArray );

			} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if ( this.content === null ) {

			throw new Error( 'THREE.GLTFLoader: JSON content not found.' );

		}

	}

}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 */
class GLTFDracoMeshCompressionExtension {

	constructor( json, dracoLoader ) {

		if ( ! dracoLoader ) {

			throw new Error( 'THREE.GLTFLoader: No DRACOLoader instance provided.' );

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();

	}

	decodePrimitive( primitive, parser ) {

		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[ this.name ].bufferView;
		const gltfAttributeMap = primitive.extensions[ this.name ].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};

		for ( const attributeName in gltfAttributeMap ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			threeAttributeMap[ threeAttributeName ] = gltfAttributeMap[ attributeName ];

		}

		for ( const attributeName in primitive.attributes ) {

			const threeAttributeName = ATTRIBUTES[ attributeName ] || attributeName.toLowerCase();

			if ( gltfAttributeMap[ attributeName ] !== undefined ) {

				const accessorDef = json.accessors[ primitive.attributes[ attributeName ] ];
				const componentType = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

				attributeTypeMap[ threeAttributeName ] = componentType.name;
				attributeNormalizedMap[ threeAttributeName ] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency( 'bufferView', bufferViewIndex ).then( function ( bufferView ) {

			return new Promise( function ( resolve ) {

				dracoLoader.decodeDracoFile( bufferView, function ( geometry ) {

					for ( const attributeName in geometry.attributes ) {

						const attribute = geometry.attributes[ attributeName ];
						const normalized = attributeNormalizedMap[ attributeName ];

						if ( normalized !== undefined ) attribute.normalized = normalized;

					}

					resolve( geometry );

				}, threeAttributeMap, attributeTypeMap );

			} );

		} );

	}

}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 */
class GLTFTextureTransformExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	extendTexture( texture, transform ) {

		if ( ( transform.texCoord === undefined || transform.texCoord === texture.channel )
			&& transform.offset === undefined
			&& transform.rotation === undefined
			&& transform.scale === undefined ) {

			// See https://github.com/mrdoob/three.js/issues/21819.
			return texture;

		}

		texture = texture.clone();

		if ( transform.texCoord !== undefined ) {

			texture.channel = transform.texCoord;

		}

		if ( transform.offset !== undefined ) {

			texture.offset.fromArray( transform.offset );

		}

		if ( transform.rotation !== undefined ) {

			texture.rotation = transform.rotation;

		}

		if ( transform.scale !== undefined ) {

			texture.repeat.fromArray( transform.scale );

		}

		texture.needsUpdate = true;

		return texture;

	}

}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 */
class GLTFMeshQuantizationExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

}

/*********************************/
/********** INTERPOLATION ********/
/*********************************/

// Spline Interpolation
// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
class GLTFCubicSplineInterpolant extends Interpolant {

	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {

		super( parameterPositions, sampleValues, sampleSize, resultBuffer );

	}

	copySampleValue_( index ) {

		// Copies a sample value to the result buffer. See description of glTF
		// CUBICSPLINE values layout in interpolate_() function below.

		const result = this.resultBuffer,
			values = this.sampleValues,
			valueSize = this.valueSize,
			offset = index * valueSize * 3 + valueSize;

		for ( let i = 0; i !== valueSize; i ++ ) {

			result[ i ] = values[ offset + i ];

		}

		return result;

	}

	interpolate_( i1, t0, t, t1 ) {

		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const stride2 = stride * 2;
		const stride3 = stride * 3;

		const td = t1 - t0;

		const p = ( t - t0 ) / td;
		const pp = p * p;
		const ppp = pp * p;

		const offset1 = i1 * stride3;
		const offset0 = offset1 - stride3;

		const s2 = -2 * ppp + 3 * pp;
		const s3 = ppp - pp;
		const s0 = 1 - s2;
		const s1 = s3 - pp + p;

		// Layout of keyframe output values for CUBICSPLINE animations:
		//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
		for ( let i = 0; i !== stride; i ++ ) {

			const p0 = values[ offset0 + i + stride ]; // splineVertex_k
			const m0 = values[ offset0 + i + stride2 ] * td; // outTangent_k * (t_k+1 - t_k)
			const p1 = values[ offset1 + i + stride ]; // splineVertex_k+1
			const m1 = values[ offset1 + i ] * td; // inTangent_k+1 * (t_k+1 - t_k)

			result[ i ] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

		}

		return result;

	}

}

const _q = new Quaternion();

class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {

	interpolate_( i1, t0, t, t1 ) {

		const result = super.interpolate_( i1, t0, t, t1 );

		_q.fromArray( result ).normalize().toArray( result );

		return result;

	}

}


/*********************************/
/********** INTERNALS ************/
/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
	FLOAT: 5126,
	//FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};

const WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};

const WEBGL_FILTERS = {
	9728: NearestFilter,
	9729: LinearFilter,
	9984: NearestMipmapNearestFilter,
	9985: LinearMipmapNearestFilter,
	9986: NearestMipmapLinearFilter,
	9987: LinearMipmapLinearFilter
};

const WEBGL_WRAPPINGS = {
	33071: ClampToEdgeWrapping,
	33648: MirroredRepeatWrapping,
	10497: RepeatWrapping
};

const WEBGL_TYPE_SIZES = {
	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16
};

const ATTRIBUTES = {
	POSITION: 'position',
	NORMAL: 'normal',
	TANGENT: 'tangent',
	TEXCOORD_0: 'uv',
	TEXCOORD_1: 'uv1',
	TEXCOORD_2: 'uv2',
	TEXCOORD_3: 'uv3',
	COLOR_0: 'color',
	WEIGHTS_0: 'skinWeight',
	JOINTS_0: 'skinIndex',
};

const PATH_PROPERTIES = {
	scale: 'scale',
	translation: 'position',
	rotation: 'quaternion',
	weights: 'morphTargetInfluences'
};

const INTERPOLATION = {
	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
		                        // keyframe track will be initialized with a default interpolation type, then modified.
	LINEAR: InterpolateLinear,
	STEP: InterpolateDiscrete
};

const ALPHA_MODES = {
	OPAQUE: 'OPAQUE',
	MASK: 'MASK',
	BLEND: 'BLEND'
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 */
function createDefaultMaterial( cache ) {

	if ( cache[ 'DefaultMaterial' ] === undefined ) {

		cache[ 'DefaultMaterial' ] = new MeshStandardMaterial( {
			color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: FrontSide
		} );

	}

	return cache[ 'DefaultMaterial' ];

}

function addUnknownExtensionsToUserData( knownExtensions, object, objectDef ) {

	// Add unknown glTF extensions to an object's userData.

	for ( const name in objectDef.extensions ) {

		if ( knownExtensions[ name ] === undefined ) {

			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[ name ] = objectDef.extensions[ name ];

		}

	}

}

/**
 * @param {Object3D|Material|BufferGeometry} object
 * @param {GLTF.definition} gltfDef
 */
function assignExtrasToUserData( object, gltfDef ) {

	if ( gltfDef.extras !== undefined ) {

		if ( typeof gltfDef.extras === 'object' ) {

			Object.assign( object.userData, gltfDef.extras );

		} else {

			console.warn( 'THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras );

		}

	}

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * @param {BufferGeometry} geometry
 * @param {Array<GLTF.Target>} targets
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addMorphTargets( geometry, targets, parser ) {

	let hasMorphPosition = false;
	let hasMorphNormal = false;
	let hasMorphColor = false;

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( target.POSITION !== undefined ) hasMorphPosition = true;
		if ( target.NORMAL !== undefined ) hasMorphNormal = true;
		if ( target.COLOR_0 !== undefined ) hasMorphColor = true;

		if ( hasMorphPosition && hasMorphNormal && hasMorphColor ) break;

	}

	if ( ! hasMorphPosition && ! hasMorphNormal && ! hasMorphColor ) return Promise.resolve( geometry );

	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];
	const pendingColorAccessors = [];

	for ( let i = 0, il = targets.length; i < il; i ++ ) {

		const target = targets[ i ];

		if ( hasMorphPosition ) {

			const pendingAccessor = target.POSITION !== undefined
				? parser.getDependency( 'accessor', target.POSITION )
				: geometry.attributes.position;

			pendingPositionAccessors.push( pendingAccessor );

		}

		if ( hasMorphNormal ) {

			const pendingAccessor = target.NORMAL !== undefined
				? parser.getDependency( 'accessor', target.NORMAL )
				: geometry.attributes.normal;

			pendingNormalAccessors.push( pendingAccessor );

		}

		if ( hasMorphColor ) {

			const pendingAccessor = target.COLOR_0 !== undefined
				? parser.getDependency( 'accessor', target.COLOR_0 )
				: geometry.attributes.color;

			pendingColorAccessors.push( pendingAccessor );

		}

	}

	return Promise.all( [
		Promise.all( pendingPositionAccessors ),
		Promise.all( pendingNormalAccessors ),
		Promise.all( pendingColorAccessors )
	] ).then( function ( accessors ) {

		const morphPositions = accessors[ 0 ];
		const morphNormals = accessors[ 1 ];
		const morphColors = accessors[ 2 ];

		if ( hasMorphPosition ) geometry.morphAttributes.position = morphPositions;
		if ( hasMorphNormal ) geometry.morphAttributes.normal = morphNormals;
		if ( hasMorphColor ) geometry.morphAttributes.color = morphColors;
		geometry.morphTargetsRelative = true;

		return geometry;

	} );

}

/**
 * @param {Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 */
function updateMorphTargets( mesh, meshDef ) {

	mesh.updateMorphTargets();

	if ( meshDef.weights !== undefined ) {

		for ( let i = 0, il = meshDef.weights.length; i < il; i ++ ) {

			mesh.morphTargetInfluences[ i ] = meshDef.weights[ i ];

		}

	}

	// .extras has user-defined data, so check that .extras.targetNames is an array.
	if ( meshDef.extras && Array.isArray( meshDef.extras.targetNames ) ) {

		const targetNames = meshDef.extras.targetNames;

		if ( mesh.morphTargetInfluences.length === targetNames.length ) {

			mesh.morphTargetDictionary = {};

			for ( let i = 0, il = targetNames.length; i < il; i ++ ) {

				mesh.morphTargetDictionary[ targetNames[ i ] ] = i;

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.' );

		}

	}

}

function createPrimitiveKey( primitiveDef ) {

	let geometryKey;

	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ];

	if ( dracoExtension ) {

		geometryKey = 'draco:' + dracoExtension.bufferView
				+ ':' + dracoExtension.indices
				+ ':' + createAttributesKey( dracoExtension.attributes );

	} else {

		geometryKey = primitiveDef.indices + ':' + createAttributesKey( primitiveDef.attributes ) + ':' + primitiveDef.mode;

	}

	if ( primitiveDef.targets !== undefined ) {

		for ( let i = 0, il = primitiveDef.targets.length; i < il; i ++ ) {

			geometryKey += ':' + createAttributesKey( primitiveDef.targets[ i ] );

		}

	}

	return geometryKey;

}

function createAttributesKey( attributes ) {

	let attributesKey = '';

	const keys = Object.keys( attributes ).sort();

	for ( let i = 0, il = keys.length; i < il; i ++ ) {

		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

	}

	return attributesKey;

}

function getNormalizedComponentScale( constructor ) {

	// Reference:
	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

	switch ( constructor ) {

		case Int8Array:
			return 1 / 127;

		case Uint8Array:
			return 1 / 255;

		case Int16Array:
			return 1 / 32767;

		case Uint16Array:
			return 1 / 65535;

		default:
			throw new Error( 'THREE.GLTFLoader: Unsupported normalized accessor component type.' );

	}

}

function getImageURIMimeType( uri ) {

	if ( uri.search( /\.jpe?g($|\?)/i ) > 0 || uri.search( /^data\:image\/jpeg/ ) === 0 ) return 'image/jpeg';
	if ( uri.search( /\.webp($|\?)/i ) > 0 || uri.search( /^data\:image\/webp/ ) === 0 ) return 'image/webp';

	return 'image/png';

}

const _identityMatrix = new Matrix4();

/* GLTF PARSER */

class GLTFParser {

	constructor( json = {}, options = {} ) {

		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Node cache
		this.nodeCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.sourceCache = {};
		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.

		let isSafari = false;
		let isFirefox = false;
		let firefoxVersion = -1;

		if ( typeof navigator !== 'undefined' ) {

			isSafari = /^((?!chrome|android).)*safari/i.test( navigator.userAgent ) === true;
			isFirefox = navigator.userAgent.indexOf( 'Firefox' ) > -1;
			firefoxVersion = isFirefox ? navigator.userAgent.match( /Firefox\/([0-9]+)\./ )[ 1 ] : -1;

		}

		if ( typeof createImageBitmap === 'undefined' || isSafari || ( isFirefox && firefoxVersion < 98 ) ) {

			this.textureLoader = new TextureLoader( this.options.manager );

		} else {

			this.textureLoader = new ImageBitmapLoader( this.options.manager );

		}

		this.textureLoader.setCrossOrigin( this.options.crossOrigin );
		this.textureLoader.setRequestHeader( this.options.requestHeader );

		this.fileLoader = new FileLoader( this.options.manager );
		this.fileLoader.setResponseType( 'arraybuffer' );

		if ( this.options.crossOrigin === 'use-credentials' ) {

			this.fileLoader.setWithCredentials( true );

		}

	}

	setExtensions( extensions ) {

		this.extensions = extensions;

	}

	setPlugins( plugins ) {

		this.plugins = plugins;

	}

	parse( onLoad, onError ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		// Clear the loader cache
		this.cache.removeAll();
		this.nodeCache = {};

		// Mark the special nodes/meshes in json for efficient parse
		this._invokeAll( function ( ext ) {

			return ext._markDefs && ext._markDefs();

		} );

		Promise.all( this._invokeAll( function ( ext ) {

			return ext.beforeRoot && ext.beforeRoot();

		} ) ).then( function () {

			return Promise.all( [

				parser.getDependencies( 'scene' ),
				parser.getDependencies( 'animation' ),
				parser.getDependencies( 'camera' ),

			] );

		} ).then( function ( dependencies ) {

			const result = {
				scene: dependencies[ 0 ][ json.scene || 0 ],
				scenes: dependencies[ 0 ],
				animations: dependencies[ 1 ],
				cameras: dependencies[ 2 ],
				asset: json.asset,
				parser: parser,
				userData: {}
			};

			addUnknownExtensionsToUserData( extensions, result, json );

			assignExtrasToUserData( result, json );

			Promise.all( parser._invokeAll( function ( ext ) {

				return ext.afterRoot && ext.afterRoot( result );

			} ) ).then( function () {

				onLoad( result );

			} );

		} ).catch( onError );

	}

	/**
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
	_markDefs() {

		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for ( let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex ++ ) {

			const joints = skinDefs[ skinIndex ].joints;

			for ( let i = 0, il = joints.length; i < il; i ++ ) {

				nodeDefs[ joints[ i ] ].isBone = true;

			}

		}

		// Iterate over all nodes, marking references to shared resources,
		// as well as skeleton joints.
		for ( let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex ++ ) {

			const nodeDef = nodeDefs[ nodeIndex ];

			if ( nodeDef.mesh !== undefined ) {

				this._addNodeRef( this.meshCache, nodeDef.mesh );

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if ( nodeDef.skin !== undefined ) {

					meshDefs[ nodeDef.mesh ].isSkinnedMesh = true;

				}

			}

			if ( nodeDef.camera !== undefined ) {

				this._addNodeRef( this.cameraCache, nodeDef.camera );

			}

		}

	}

	/**
	 * Counts references to shared node / Object3D resources. These resources
	 * can be reused, or "instantiated", at multiple nodes in the scene
	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
	 * Textures) can be reused directly and are not marked here.
	 *
	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	 */
	_addNodeRef( cache, index ) {

		if ( index === undefined ) return;

		if ( cache.refs[ index ] === undefined ) {

			cache.refs[ index ] = cache.uses[ index ] = 0;

		}

		cache.refs[ index ] ++;

	}

	/** Returns a reference to a shared resource, cloning it if necessary. */
	_getNodeRef( cache, index, object ) {

		if ( cache.refs[ index ] <= 1 ) return object;

		const ref = object.clone();

		// Propagates mappings to the cloned object, prevents mappings on the
		// original object from being lost.
		const updateMappings = ( original, clone ) => {

			const mappings = this.associations.get( original );
			if ( mappings != null ) {

				this.associations.set( clone, mappings );

			}

			for ( const [ i, child ] of original.children.entries() ) {

				updateMappings( child, clone.children[ i ] );

			}

		};

		updateMappings( object, ref );

		ref.name += '_instance_' + ( cache.uses[ index ] ++ );

		return ref;

	}

	_invokeOne( func ) {

		const extensions = Object.values( this.plugins );
		extensions.push( this );

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) return result;

		}

		return null;

	}

	_invokeAll( func ) {

		const extensions = Object.values( this.plugins );
		extensions.unshift( this );

		const pending = [];

		for ( let i = 0; i < extensions.length; i ++ ) {

			const result = func( extensions[ i ] );

			if ( result ) pending.push( result );

		}

		return pending;

	}

	/**
	 * Requests the specified dependency asynchronously, with caching.
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
	 */
	getDependency( type, index ) {

		const cacheKey = type + ':' + index;
		let dependency = this.cache.get( cacheKey );

		if ( ! dependency ) {

			switch ( type ) {

				case 'scene':
					dependency = this.loadScene( index );
					break;

				case 'node':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadNode && ext.loadNode( index );

					} );
					break;

				case 'mesh':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMesh && ext.loadMesh( index );

					} );
					break;

				case 'accessor':
					dependency = this.loadAccessor( index );
					break;

				case 'bufferView':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadBufferView && ext.loadBufferView( index );

					} );
					break;

				case 'buffer':
					dependency = this.loadBuffer( index );
					break;

				case 'material':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadMaterial && ext.loadMaterial( index );

					} );
					break;

				case 'texture':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadTexture && ext.loadTexture( index );

					} );
					break;

				case 'skin':
					dependency = this.loadSkin( index );
					break;

				case 'animation':
					dependency = this._invokeOne( function ( ext ) {

						return ext.loadAnimation && ext.loadAnimation( index );

					} );
					break;

				case 'camera':
					dependency = this.loadCamera( index );
					break;

				default:
					dependency = this._invokeOne( function ( ext ) {

						return ext != this && ext.getDependency && ext.getDependency( type, index );

					} );

					if ( ! dependency ) {

						throw new Error( 'Unknown type: ' + type );

					}

					break;

			}

			this.cache.add( cacheKey, dependency );

		}

		return dependency;

	}

	/**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
	getDependencies( type ) {

		let dependencies = this.cache.get( type );

		if ( ! dependencies ) {

			const parser = this;
			const defs = this.json[ type + ( type === 'mesh' ? 'es' : 's' ) ] || [];

			dependencies = Promise.all( defs.map( function ( def, index ) {

				return parser.getDependency( type, index );

			} ) );

			this.cache.add( type, dependencies );

		}

		return dependencies;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBuffer( bufferIndex ) {

		const bufferDef = this.json.buffers[ bufferIndex ];
		const loader = this.fileLoader;

		if ( bufferDef.type && bufferDef.type !== 'arraybuffer' ) {

			throw new Error( 'THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.' );

		}

		// If present, GLB container is required to be the first buffer.
		if ( bufferDef.uri === undefined && bufferIndex === 0 ) {

			return Promise.resolve( this.extensions[ EXTENSIONS.KHR_BINARY_GLTF ].body );

		}

		const options = this.options;

		return new Promise( function ( resolve, reject ) {

			loader.load( LoaderUtils.resolveURL( bufferDef.uri, options.path ), resolve, undefined, function () {

				reject( new Error( 'THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".' ) );

			} );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBufferView( bufferViewIndex ) {

		const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];

		return this.getDependency( 'buffer', bufferViewDef.buffer ).then( function ( buffer ) {

			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice( byteOffset, byteOffset + byteLength );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	 */
	loadAccessor( accessorIndex ) {

		const parser = this;
		const json = this.json;

		const accessorDef = this.json.accessors[ accessorIndex ];

		if ( accessorDef.bufferView === undefined && accessorDef.sparse === undefined ) {

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];
			const normalized = accessorDef.normalized === true;

			const array = new TypedArray( accessorDef.count * itemSize );
			return Promise.resolve( new BufferAttribute( array, itemSize, normalized ) );

		}

		const pendingBufferViews = [];

		if ( accessorDef.bufferView !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.bufferView ) );

		} else {

			pendingBufferViews.push( null );

		}

		if ( accessorDef.sparse !== undefined ) {

			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.indices.bufferView ) );
			pendingBufferViews.push( this.getDependency( 'bufferView', accessorDef.sparse.values.bufferView ) );

		}

		return Promise.all( pendingBufferViews ).then( function ( bufferViews ) {

			const bufferView = bufferViews[ 0 ];

			const itemSize = WEBGL_TYPE_SIZES[ accessorDef.type ];
			const TypedArray = WEBGL_COMPONENT_TYPES[ accessorDef.componentType ];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[ accessorDef.bufferView ].byteStride : undefined;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if ( byteStride && byteStride !== itemBytes ) {

				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
				// This makes sure that IBA.count reflects accessor.count properly
				const ibSlice = Math.floor( byteOffset / byteStride );
				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
				let ib = parser.cache.get( ibCacheKey );

				if ( ! ib ) {

					array = new TypedArray( bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes );

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new InterleavedBuffer( array, byteStride / elementBytes );

					parser.cache.add( ibCacheKey, ib );

				}

				bufferAttribute = new InterleavedBufferAttribute( ib, itemSize, ( byteOffset % byteStride ) / elementBytes, normalized );

			} else {

				if ( bufferView === null ) {

					array = new TypedArray( accessorDef.count * itemSize );

				} else {

					array = new TypedArray( bufferView, byteOffset, accessorDef.count * itemSize );

				}

				bufferAttribute = new BufferAttribute( array, itemSize, normalized );

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if ( accessorDef.sparse !== undefined ) {

				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[ accessorDef.sparse.indices.componentType ];

				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				const sparseIndices = new TypedArrayIndices( bufferViews[ 1 ], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices );
				const sparseValues = new TypedArray( bufferViews[ 2 ], byteOffsetValues, accessorDef.sparse.count * itemSize );

				if ( bufferView !== null ) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute = new BufferAttribute( bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized );

				}

				for ( let i = 0, il = sparseIndices.length; i < il; i ++ ) {

					const index = sparseIndices[ i ];

					bufferAttribute.setX( index, sparseValues[ i * itemSize ] );
					if ( itemSize >= 2 ) bufferAttribute.setY( index, sparseValues[ i * itemSize + 1 ] );
					if ( itemSize >= 3 ) bufferAttribute.setZ( index, sparseValues[ i * itemSize + 2 ] );
					if ( itemSize >= 4 ) bufferAttribute.setW( index, sparseValues[ i * itemSize + 3 ] );
					if ( itemSize >= 5 ) throw new Error( 'THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.' );

				}

			}

			return bufferAttribute;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture|null>}
	 */
	loadTexture( textureIndex ) {

		const json = this.json;
		const options = this.options;
		const textureDef = json.textures[ textureIndex ];
		const sourceIndex = textureDef.source;
		const sourceDef = json.images[ sourceIndex ];

		let loader = this.textureLoader;

		if ( sourceDef.uri ) {

			const handler = options.manager.getHandler( sourceDef.uri );
			if ( handler !== null ) loader = handler;

		}

		return this.loadTextureImage( textureIndex, sourceIndex, loader );

	}

	loadTextureImage( textureIndex, sourceIndex, loader ) {

		const parser = this;
		const json = this.json;

		const textureDef = json.textures[ textureIndex ];
		const sourceDef = json.images[ sourceIndex ];

		const cacheKey = ( sourceDef.uri || sourceDef.bufferView ) + ':' + textureDef.sampler;

		if ( this.textureCache[ cacheKey ] ) {

			// See https://github.com/mrdoob/three.js/issues/21559.
			return this.textureCache[ cacheKey ];

		}

		const promise = this.loadImageSource( sourceIndex, loader ).then( function ( texture ) {

			texture.flipY = false;

			texture.name = textureDef.name || sourceDef.name || '';

			if ( texture.name === '' && typeof sourceDef.uri === 'string' && sourceDef.uri.startsWith( 'data:image/' ) === false ) {

				texture.name = sourceDef.uri;

			}

			const samplers = json.samplers || {};
			const sampler = samplers[ textureDef.sampler ] || {};

			texture.magFilter = WEBGL_FILTERS[ sampler.magFilter ] || LinearFilter;
			texture.minFilter = WEBGL_FILTERS[ sampler.minFilter ] || LinearMipmapLinearFilter;
			texture.wrapS = WEBGL_WRAPPINGS[ sampler.wrapS ] || RepeatWrapping;
			texture.wrapT = WEBGL_WRAPPINGS[ sampler.wrapT ] || RepeatWrapping;

			parser.associations.set( texture, { textures: textureIndex } );

			return texture;

		} ).catch( function () {

			return null;

		} );

		this.textureCache[ cacheKey ] = promise;

		return promise;

	}

	loadImageSource( sourceIndex, loader ) {

		const parser = this;
		const json = this.json;
		const options = this.options;

		if ( this.sourceCache[ sourceIndex ] !== undefined ) {

			return this.sourceCache[ sourceIndex ].then( ( texture ) => texture.clone() );

		}

		const sourceDef = json.images[ sourceIndex ];

		const URL = self.URL || self.webkitURL;

		let sourceURI = sourceDef.uri || '';
		let isObjectURL = false;

		if ( sourceDef.bufferView !== undefined ) {

			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency( 'bufferView', sourceDef.bufferView ).then( function ( bufferView ) {

				isObjectURL = true;
				const blob = new Blob( [ bufferView ], { type: sourceDef.mimeType } );
				sourceURI = URL.createObjectURL( blob );
				return sourceURI;

			} );

		} else if ( sourceDef.uri === undefined ) {

			throw new Error( 'THREE.GLTFLoader: Image ' + sourceIndex + ' is missing URI and bufferView' );

		}

		const promise = Promise.resolve( sourceURI ).then( function ( sourceURI ) {

			return new Promise( function ( resolve, reject ) {

				let onLoad = resolve;

				if ( loader.isImageBitmapLoader === true ) {

					onLoad = function ( imageBitmap ) {

						const texture = new Texture( imageBitmap );
						texture.needsUpdate = true;

						resolve( texture );

					};

				}

				loader.load( LoaderUtils.resolveURL( sourceURI, options.path ), onLoad, undefined, reject );

			} );

		} ).then( function ( texture ) {

			// Clean up resources and configure Texture.

			if ( isObjectURL === true ) {

				URL.revokeObjectURL( sourceURI );

			}

			texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType( sourceDef.uri );

			return texture;

		} ).catch( function ( error ) {

			console.error( 'THREE.GLTFLoader: Couldn\'t load texture', sourceURI );
			throw error;

		} );

		this.sourceCache[ sourceIndex ] = promise;
		return promise;

	}

	/**
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} mapName
	 * @param {Object} mapDef
	 * @return {Promise<Texture>}
	 */
	assignTexture( materialParams, mapName, mapDef, colorSpace ) {

		const parser = this;

		return this.getDependency( 'texture', mapDef.index ).then( function ( texture ) {

			if ( ! texture ) return null;

			if ( mapDef.texCoord !== undefined && mapDef.texCoord > 0 ) {

				texture = texture.clone();
				texture.channel = mapDef.texCoord;

			}

			if ( parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] ) {

				const transform = mapDef.extensions !== undefined ? mapDef.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ] : undefined;

				if ( transform ) {

					const gltfReference = parser.associations.get( texture );
					texture = parser.extensions[ EXTENSIONS.KHR_TEXTURE_TRANSFORM ].extendTexture( texture, transform );
					parser.associations.set( texture, gltfReference );

				}

			}

			if ( colorSpace !== undefined ) {

				texture.colorSpace = colorSpace;

			}

			materialParams[ mapName ] = texture;

			return texture;

		} );

	}

	/**
	 * Assigns final material to a Mesh, Line, or Points instance. The instance
	 * already has a material (generated from the glTF material options alone)
	 * but reuse of the same glTF material may require multiple threejs materials
	 * to accommodate different primitive types, defines, etc. New materials will
	 * be created if necessary, and reused from a cache.
	 * @param  {Object3D} mesh Mesh, Line, or Points instance.
	 */
	assignFinalMaterial( mesh ) {

		const geometry = mesh.geometry;
		let material = mesh.material;

		const useDerivativeTangents = geometry.attributes.tangent === undefined;
		const useVertexColors = geometry.attributes.color !== undefined;
		const useFlatShading = geometry.attributes.normal === undefined;

		if ( mesh.isPoints ) {

			const cacheKey = 'PointsMaterial:' + material.uuid;

			let pointsMaterial = this.cache.get( cacheKey );

			if ( ! pointsMaterial ) {

				pointsMaterial = new PointsMaterial();
				Material.prototype.copy.call( pointsMaterial, material );
				pointsMaterial.color.copy( material.color );
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

				this.cache.add( cacheKey, pointsMaterial );

			}

			material = pointsMaterial;

		} else if ( mesh.isLine ) {

			const cacheKey = 'LineBasicMaterial:' + material.uuid;

			let lineMaterial = this.cache.get( cacheKey );

			if ( ! lineMaterial ) {

				lineMaterial = new LineBasicMaterial();
				Material.prototype.copy.call( lineMaterial, material );
				lineMaterial.color.copy( material.color );
				lineMaterial.map = material.map;

				this.cache.add( cacheKey, lineMaterial );

			}

			material = lineMaterial;

		}

		// Clone the material if it will be modified
		if ( useDerivativeTangents || useVertexColors || useFlatShading ) {

			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

			if ( useDerivativeTangents ) cacheKey += 'derivative-tangents:';
			if ( useVertexColors ) cacheKey += 'vertex-colors:';
			if ( useFlatShading ) cacheKey += 'flat-shading:';

			let cachedMaterial = this.cache.get( cacheKey );

			if ( ! cachedMaterial ) {

				cachedMaterial = material.clone();

				if ( useVertexColors ) cachedMaterial.vertexColors = true;
				if ( useFlatShading ) cachedMaterial.flatShading = true;

				if ( useDerivativeTangents ) {

					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
					if ( cachedMaterial.normalScale ) cachedMaterial.normalScale.y *= -1;
					if ( cachedMaterial.clearcoatNormalScale ) cachedMaterial.clearcoatNormalScale.y *= -1;

				}

				this.cache.add( cacheKey, cachedMaterial );

				this.associations.set( cachedMaterial, this.associations.get( material ) );

			}

			material = cachedMaterial;

		}

		mesh.material = material;

	}

	getMaterialType( /* materialIndex */ ) {

		return MeshStandardMaterial;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<Material>}
	 */
	loadMaterial( materialIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[ materialIndex ];

		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};

		const pending = [];

		if ( materialExtensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ] ) {

			const kmuExtension = extensions[ EXTENSIONS.KHR_MATERIALS_UNLIT ];
			materialType = kmuExtension.getMaterialType();
			pending.push( kmuExtension.extendParams( materialParams, materialDef, parser ) );

		} else {

			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

			materialParams.color = new Color( 1.0, 1.0, 1.0 );
			materialParams.opacity = 1.0;

			if ( Array.isArray( metallicRoughness.baseColorFactor ) ) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray( array );
				materialParams.opacity = array[ 3 ];

			}

			if ( metallicRoughness.baseColorTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace ) );

			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			if ( metallicRoughness.metallicRoughnessTexture !== undefined ) {

				pending.push( parser.assignTexture( materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture ) );
				pending.push( parser.assignTexture( materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture ) );

			}

			materialType = this._invokeOne( function ( ext ) {

				return ext.getMaterialType && ext.getMaterialType( materialIndex );

			} );

			pending.push( Promise.all( this._invokeAll( function ( ext ) {

				return ext.extendMaterialParams && ext.extendMaterialParams( materialIndex, materialParams );

			} ) ) );

		}

		if ( materialDef.doubleSided === true ) {

			materialParams.side = DoubleSide;

		}

		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if ( alphaMode === ALPHA_MODES.BLEND ) {

			materialParams.transparent = true;

			// See: https://github.com/mrdoob/three.js/issues/17706
			materialParams.depthWrite = false;

		} else {

			materialParams.transparent = false;

			if ( alphaMode === ALPHA_MODES.MASK ) {

				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

			}

		}

		if ( materialDef.normalTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'normalMap', materialDef.normalTexture ) );

			materialParams.normalScale = new Vector2( 1, 1 );

			if ( materialDef.normalTexture.scale !== undefined ) {

				const scale = materialDef.normalTexture.scale;

				materialParams.normalScale.set( scale, scale );

			}

		}

		if ( materialDef.occlusionTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'aoMap', materialDef.occlusionTexture ) );

			if ( materialDef.occlusionTexture.strength !== undefined ) {

				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

			}

		}

		if ( materialDef.emissiveFactor !== undefined && materialType !== MeshBasicMaterial ) {

			materialParams.emissive = new Color().fromArray( materialDef.emissiveFactor );

		}

		if ( materialDef.emissiveTexture !== undefined && materialType !== MeshBasicMaterial ) {

			pending.push( parser.assignTexture( materialParams, 'emissiveMap', materialDef.emissiveTexture, SRGBColorSpace ) );

		}

		return Promise.all( pending ).then( function () {

			const material = new materialType( materialParams );

			if ( materialDef.name ) material.name = materialDef.name;

			assignExtrasToUserData( material, materialDef );

			parser.associations.set( material, { materials: materialIndex } );

			if ( materialDef.extensions ) addUnknownExtensionsToUserData( extensions, material, materialDef );

			return material;

		} );

	}

	/** When Object3D instances are targeted by animation, they need unique names. */
	createUniqueName( originalName ) {

		const sanitizedName = PropertyBinding.sanitizeNodeName( originalName || '' );

		if ( sanitizedName in this.nodeNamesUsed ) {

			return sanitizedName + '_' + ( ++ this.nodeNamesUsed[ sanitizedName ] );

		} else {

			this.nodeNamesUsed[ sanitizedName ] = 0;

			return sanitizedName;

		}

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 *
	 * @param {Array<GLTF.Primitive>} primitives
	 * @return {Promise<Array<BufferGeometry>>}
	 */
	loadGeometries( primitives ) {

		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;

		function createDracoPrimitive( primitive ) {

			return extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ]
				.decodePrimitive( primitive, parser )
				.then( function ( geometry ) {

					return addPrimitiveAttributes( geometry, primitive, parser );

				} );

		}

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const primitive = primitives[ i ];
			const cacheKey = createPrimitiveKey( primitive );

			// See if we've already created this geometry
			const cached = cache[ cacheKey ];

			if ( cached ) {

				// Use the cached geometry if it exists
				pending.push( cached.promise );

			} else {

				let geometryPromise;

				if ( primitive.extensions && primitive.extensions[ EXTENSIONS.KHR_DRACO_MESH_COMPRESSION ] ) {

					// Use DRACO geometry if available
					geometryPromise = createDracoPrimitive( primitive );

				} else {

					// Otherwise create a new geometry
					geometryPromise = addPrimitiveAttributes( new BufferGeometry(), primitive, parser );

				}

				// Cache this geometry
				cache[ cacheKey ] = { primitive: primitive, promise: geometryPromise };

				pending.push( geometryPromise );

			}

		}

		return Promise.all( pending );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	 * @param {number} meshIndex
	 * @return {Promise<Group|Mesh|SkinnedMesh>}
	 */
	loadMesh( meshIndex ) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		const meshDef = json.meshes[ meshIndex ];
		const primitives = meshDef.primitives;

		const pending = [];

		for ( let i = 0, il = primitives.length; i < il; i ++ ) {

			const material = primitives[ i ].material === undefined
				? createDefaultMaterial( this.cache )
				: this.getDependency( 'material', primitives[ i ].material );

			pending.push( material );

		}

		pending.push( parser.loadGeometries( primitives ) );

		return Promise.all( pending ).then( function ( results ) {

			const materials = results.slice( 0, results.length - 1 );
			const geometries = results[ results.length - 1 ];

			const meshes = [];

			for ( let i = 0, il = geometries.length; i < il; i ++ ) {

				const geometry = geometries[ i ];
				const primitive = primitives[ i ];

				// 1. create Mesh

				let mesh;

				const material = materials[ i ];

				if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
						primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
						primitive.mode === undefined ) {

					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
					mesh = meshDef.isSkinnedMesh === true
						? new SkinnedMesh( geometry, material )
						: new Mesh( geometry, material );

					if ( mesh.isSkinnedMesh === true ) {

						// normalize skin weights to fix malformed assets (see #15319)
						mesh.normalizeSkinWeights();

					}

					if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleStripDrawMode );

					} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

						mesh.geometry = toTrianglesDrawMode( mesh.geometry, TriangleFanDrawMode );

					}

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

					mesh = new LineSegments( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

					mesh = new Line( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

					mesh = new LineLoop( geometry, material );

				} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

					mesh = new Points( geometry, material );

				} else {

					throw new Error( 'THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode );

				}

				if ( Object.keys( mesh.geometry.morphAttributes ).length > 0 ) {

					updateMorphTargets( mesh, meshDef );

				}

				mesh.name = parser.createUniqueName( meshDef.name || ( 'mesh_' + meshIndex ) );

				assignExtrasToUserData( mesh, meshDef );

				if ( primitive.extensions ) addUnknownExtensionsToUserData( extensions, mesh, primitive );

				parser.assignFinalMaterial( mesh );

				meshes.push( mesh );

			}

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				parser.associations.set( meshes[ i ], {
					meshes: meshIndex,
					primitives: i
				} );

			}

			if ( meshes.length === 1 ) {

				if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, meshes[ 0 ], meshDef );

				return meshes[ 0 ];

			}

			const group = new Group();

			if ( meshDef.extensions ) addUnknownExtensionsToUserData( extensions, group, meshDef );

			parser.associations.set( group, { meshes: meshIndex } );

			for ( let i = 0, il = meshes.length; i < il; i ++ ) {

				group.add( meshes[ i ] );

			}

			return group;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 * @return {Promise<THREE.Camera>}
	 */
	loadCamera( cameraIndex ) {

		let camera;
		const cameraDef = this.json.cameras[ cameraIndex ];
		const params = cameraDef[ cameraDef.type ];

		if ( ! params ) {

			console.warn( 'THREE.GLTFLoader: Missing camera parameters.' );
			return;

		}

		if ( cameraDef.type === 'perspective' ) {

			camera = new PerspectiveCamera( MathUtils.radToDeg( params.yfov ), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6 );

		} else if ( cameraDef.type === 'orthographic' ) {

			camera = new OrthographicCamera( - params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar );

		}

		if ( cameraDef.name ) camera.name = this.createUniqueName( cameraDef.name );

		assignExtrasToUserData( camera, cameraDef );

		return Promise.resolve( camera );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 * @return {Promise<Skeleton>}
	 */
	loadSkin( skinIndex ) {

		const skinDef = this.json.skins[ skinIndex ];

		const pending = [];

		for ( let i = 0, il = skinDef.joints.length; i < il; i ++ ) {

			pending.push( this._loadNodeShallow( skinDef.joints[ i ] ) );

		}

		if ( skinDef.inverseBindMatrices !== undefined ) {

			pending.push( this.getDependency( 'accessor', skinDef.inverseBindMatrices ) );

		} else {

			pending.push( null );

		}

		return Promise.all( pending ).then( function ( results ) {

			const inverseBindMatrices = results.pop();
			const jointNodes = results;

			// Note that bones (joint nodes) may or may not be in the
			// scene graph at this time.

			const bones = [];
			const boneInverses = [];

			for ( let i = 0, il = jointNodes.length; i < il; i ++ ) {

				const jointNode = jointNodes[ i ];

				if ( jointNode ) {

					bones.push( jointNode );

					const mat = new Matrix4();

					if ( inverseBindMatrices !== null ) {

						mat.fromArray( inverseBindMatrices.array, i * 16 );

					}

					boneInverses.push( mat );

				} else {

					console.warn( 'THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[ i ] );

				}

			}

			return new Skeleton( bones, boneInverses );

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 * @return {Promise<AnimationClip>}
	 */
	loadAnimation( animationIndex ) {

		const json = this.json;

		const animationDef = json.animations[ animationIndex ];
		const animationName = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];

		for ( let i = 0, il = animationDef.channels.length; i < il; i ++ ) {

			const channel = animationDef.channels[ i ];
			const sampler = animationDef.samplers[ channel.sampler ];
			const target = channel.target;
			const name = target.node;
			const input = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.input ] : sampler.input;
			const output = animationDef.parameters !== undefined ? animationDef.parameters[ sampler.output ] : sampler.output;

			if ( target.node === undefined ) continue;

			pendingNodes.push( this.getDependency( 'node', name ) );
			pendingInputAccessors.push( this.getDependency( 'accessor', input ) );
			pendingOutputAccessors.push( this.getDependency( 'accessor', output ) );
			pendingSamplers.push( sampler );
			pendingTargets.push( target );

		}

		return Promise.all( [

			Promise.all( pendingNodes ),
			Promise.all( pendingInputAccessors ),
			Promise.all( pendingOutputAccessors ),
			Promise.all( pendingSamplers ),
			Promise.all( pendingTargets )

		] ).then( function ( dependencies ) {

			const nodes = dependencies[ 0 ];
			const inputAccessors = dependencies[ 1 ];
			const outputAccessors = dependencies[ 2 ];
			const samplers = dependencies[ 3 ];
			const targets = dependencies[ 4 ];

			const tracks = [];

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				const node = nodes[ i ];
				const inputAccessor = inputAccessors[ i ];
				const outputAccessor = outputAccessors[ i ];
				const sampler = samplers[ i ];
				const target = targets[ i ];

				if ( node === undefined ) continue;

				node.updateMatrix();

				let TypedKeyframeTrack;

				switch ( PATH_PROPERTIES[ target.path ] ) {

					case PATH_PROPERTIES.weights:

						TypedKeyframeTrack = NumberKeyframeTrack;
						break;

					case PATH_PROPERTIES.rotation:

						TypedKeyframeTrack = QuaternionKeyframeTrack;
						break;

					case PATH_PROPERTIES.position:
					case PATH_PROPERTIES.scale:
					default:

						TypedKeyframeTrack = VectorKeyframeTrack;
						break;

				}

				const targetName = node.name ? node.name : node.uuid;

				const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[ sampler.interpolation ] : InterpolateLinear;

				const targetNames = [];

				if ( PATH_PROPERTIES[ target.path ] === PATH_PROPERTIES.weights ) {

					node.traverse( function ( object ) {

						if ( object.morphTargetInfluences ) {

							targetNames.push( object.name ? object.name : object.uuid );

						}

					} );

				} else {

					targetNames.push( targetName );

				}

				let outputArray = outputAccessor.array;

				if ( outputAccessor.normalized ) {

					const scale = getNormalizedComponentScale( outputArray.constructor );
					const scaled = new Float32Array( outputArray.length );

					for ( let j = 0, jl = outputArray.length; j < jl; j ++ ) {

						scaled[ j ] = outputArray[ j ] * scale;

					}

					outputArray = scaled;

				}

				for ( let j = 0, jl = targetNames.length; j < jl; j ++ ) {

					const track = new TypedKeyframeTrack(
						targetNames[ j ] + '.' + PATH_PROPERTIES[ target.path ],
						inputAccessor.array,
						outputArray,
						interpolation
					);

					// Override interpolation with custom factory method.
					if ( sampler.interpolation === 'CUBICSPLINE' ) {

						track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline( result ) {

							// A CUBICSPLINE keyframe in glTF has three output values for each input value,
							// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
							// must be divided by three to get the interpolant's sampleSize argument.

							const interpolantType = ( this instanceof QuaternionKeyframeTrack ) ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;

							return new interpolantType( this.times, this.values, this.getValueSize() / 3, result );

						};

						// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
						track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

					}

					tracks.push( track );

				}

			}

			return new AnimationClip( animationName, undefined, tracks );

		} );

	}

	createNodeMesh( nodeIndex ) {

		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[ nodeIndex ];

		if ( nodeDef.mesh === undefined ) return null;

		return parser.getDependency( 'mesh', nodeDef.mesh ).then( function ( mesh ) {

			const node = parser._getNodeRef( parser.meshCache, nodeDef.mesh, mesh );

			// if weights are provided on the node, override weights on the mesh.
			if ( nodeDef.weights !== undefined ) {

				node.traverse( function ( o ) {

					if ( ! o.isMesh ) return;

					for ( let i = 0, il = nodeDef.weights.length; i < il; i ++ ) {

						o.morphTargetInfluences[ i ] = nodeDef.weights[ i ];

					}

				} );

			}

			return node;

		} );

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 * @return {Promise<Object3D>}
	 */
	loadNode( nodeIndex ) {

		const json = this.json;
		const parser = this;

		const nodeDef = json.nodes[ nodeIndex ];

		const nodePending = parser._loadNodeShallow( nodeIndex );

		const childPending = [];
		const childrenDef = nodeDef.children || [];

		for ( let i = 0, il = childrenDef.length; i < il; i ++ ) {

			childPending.push( parser.getDependency( 'node', childrenDef[ i ] ) );

		}

		const skeletonPending = nodeDef.skin === undefined
			? Promise.resolve( null )
			: parser.getDependency( 'skin', nodeDef.skin );

		return Promise.all( [
			nodePending,
			Promise.all( childPending ),
			skeletonPending
		] ).then( function ( results ) {

			const node = results[ 0 ];
			const children = results[ 1 ];
			const skeleton = results[ 2 ];

			if ( skeleton !== null ) {

				// This full traverse should be fine because
				// child glTF nodes have not been added to this node yet.
				node.traverse( function ( mesh ) {

					if ( ! mesh.isSkinnedMesh ) return;

					mesh.bind( skeleton, _identityMatrix );

				} );

			}

			for ( let i = 0, il = children.length; i < il; i ++ ) {

				node.add( children[ i ] );

			}

			return node;

		} );

	}

	// ._loadNodeShallow() parses a single node.
	// skin and child nodes are created and added in .loadNode() (no '_' prefix).
	_loadNodeShallow( nodeIndex ) {

		const json = this.json;
		const extensions = this.extensions;
		const parser = this;

		// This method is called from .loadNode() and .loadSkin().
		// Cache a node to avoid duplication.

		if ( this.nodeCache[ nodeIndex ] !== undefined ) {

			return this.nodeCache[ nodeIndex ];

		}

		const nodeDef = json.nodes[ nodeIndex ];

		// reserve node's name before its dependencies, so the root has the intended name.
		const nodeName = nodeDef.name ? parser.createUniqueName( nodeDef.name ) : '';

		const pending = [];

		const meshPromise = parser._invokeOne( function ( ext ) {

			return ext.createNodeMesh && ext.createNodeMesh( nodeIndex );

		} );

		if ( meshPromise ) {

			pending.push( meshPromise );

		}

		if ( nodeDef.camera !== undefined ) {

			pending.push( parser.getDependency( 'camera', nodeDef.camera ).then( function ( camera ) {

				return parser._getNodeRef( parser.cameraCache, nodeDef.camera, camera );

			} ) );

		}

		parser._invokeAll( function ( ext ) {

			return ext.createNodeAttachment && ext.createNodeAttachment( nodeIndex );

		} ).forEach( function ( promise ) {

			pending.push( promise );

		} );

		this.nodeCache[ nodeIndex ] = Promise.all( pending ).then( function ( objects ) {

			let node;

			// .isBone isn't in glTF spec. See ._markDefs
			if ( nodeDef.isBone === true ) {

				node = new Bone();

			} else if ( objects.length > 1 ) {

				node = new Group();

			} else if ( objects.length === 1 ) {

				node = objects[ 0 ];

			} else {

				node = new Object3D();

			}

			if ( node !== objects[ 0 ] ) {

				for ( let i = 0, il = objects.length; i < il; i ++ ) {

					node.add( objects[ i ] );

				}

			}

			if ( nodeDef.name ) {

				node.userData.name = nodeDef.name;
				node.name = nodeName;

			}

			assignExtrasToUserData( node, nodeDef );

			if ( nodeDef.extensions ) addUnknownExtensionsToUserData( extensions, node, nodeDef );

			if ( nodeDef.matrix !== undefined ) {

				const matrix = new Matrix4();
				matrix.fromArray( nodeDef.matrix );
				node.applyMatrix4( matrix );

			} else {

				if ( nodeDef.translation !== undefined ) {

					node.position.fromArray( nodeDef.translation );

				}

				if ( nodeDef.rotation !== undefined ) {

					node.quaternion.fromArray( nodeDef.rotation );

				}

				if ( nodeDef.scale !== undefined ) {

					node.scale.fromArray( nodeDef.scale );

				}

			}

			if ( ! parser.associations.has( node ) ) {

				parser.associations.set( node, {} );

			}

			parser.associations.get( node ).nodes = nodeIndex;

			return node;

		} );

		return this.nodeCache[ nodeIndex ];

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 * @return {Promise<Group>}
	 */
	loadScene( sceneIndex ) {

		const extensions = this.extensions;
		const sceneDef = this.json.scenes[ sceneIndex ];
		const parser = this;

		// Loader returns Group, not Scene.
		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
		const scene = new Group();
		if ( sceneDef.name ) scene.name = parser.createUniqueName( sceneDef.name );

		assignExtrasToUserData( scene, sceneDef );

		if ( sceneDef.extensions ) addUnknownExtensionsToUserData( extensions, scene, sceneDef );

		const nodeIds = sceneDef.nodes || [];

		const pending = [];

		for ( let i = 0, il = nodeIds.length; i < il; i ++ ) {

			pending.push( parser.getDependency( 'node', nodeIds[ i ] ) );

		}

		return Promise.all( pending ).then( function ( nodes ) {

			for ( let i = 0, il = nodes.length; i < il; i ++ ) {

				scene.add( nodes[ i ] );

			}

			// Removes dangling associations, associations that reference a node that
			// didn't make it into the scene.
			const reduceAssociations = ( node ) => {

				const reducedAssociations = new Map();

				for ( const [ key, value ] of parser.associations ) {

					if ( key instanceof Material || key instanceof Texture ) {

						reducedAssociations.set( key, value );

					}

				}

				node.traverse( ( node ) => {

					const mappings = parser.associations.get( node );

					if ( mappings != null ) {

						reducedAssociations.set( node, mappings );

					}

				} );

				return reducedAssociations;

			};

			parser.associations = reduceAssociations( scene );

			return scene;

		} );

	}

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 */
function computeBounds( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const box = new Box3();

	if ( attributes.POSITION !== undefined ) {

		const accessor = parser.json.accessors[ attributes.POSITION ];

		const min = accessor.min;
		const max = accessor.max;

		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

		if ( min !== undefined && max !== undefined ) {

			box.set(
				new Vector3( min[ 0 ], min[ 1 ], min[ 2 ] ),
				new Vector3( max[ 0 ], max[ 1 ], max[ 2 ] )
			);

			if ( accessor.normalized ) {

				const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
				box.min.multiplyScalar( boxScale );
				box.max.multiplyScalar( boxScale );

			}

		} else {

			console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

			return;

		}

	} else {

		return;

	}

	const targets = primitiveDef.targets;

	if ( targets !== undefined ) {

		const maxDisplacement = new Vector3();
		const vector = new Vector3();

		for ( let i = 0, il = targets.length; i < il; i ++ ) {

			const target = targets[ i ];

			if ( target.POSITION !== undefined ) {

				const accessor = parser.json.accessors[ target.POSITION ];
				const min = accessor.min;
				const max = accessor.max;

				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

				if ( min !== undefined && max !== undefined ) {

					// we need to get max of absolute components because target weight is [-1,1]
					vector.setX( Math.max( Math.abs( min[ 0 ] ), Math.abs( max[ 0 ] ) ) );
					vector.setY( Math.max( Math.abs( min[ 1 ] ), Math.abs( max[ 1 ] ) ) );
					vector.setZ( Math.max( Math.abs( min[ 2 ] ), Math.abs( max[ 2 ] ) ) );


					if ( accessor.normalized ) {

						const boxScale = getNormalizedComponentScale( WEBGL_COMPONENT_TYPES[ accessor.componentType ] );
						vector.multiplyScalar( boxScale );

					}

					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
					maxDisplacement.max( vector );

				} else {

					console.warn( 'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.' );

				}

			}

		}

		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
		box.expandByVector( maxDisplacement );

	}

	geometry.boundingBox = box;

	const sphere = new Sphere();

	box.getCenter( sphere.center );
	sphere.radius = box.min.distanceTo( box.max ) / 2;

	geometry.boundingSphere = sphere;

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addPrimitiveAttributes( geometry, primitiveDef, parser ) {

	const attributes = primitiveDef.attributes;

	const pending = [];

	function assignAttributeAccessor( accessorIndex, attributeName ) {

		return parser.getDependency( 'accessor', accessorIndex )
			.then( function ( accessor ) {

				geometry.setAttribute( attributeName, accessor );

			} );

	}

	for ( const gltfAttributeName in attributes ) {

		const threeAttributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

		// Skip attributes already provided by e.g. Draco extension.
		if ( threeAttributeName in geometry.attributes ) continue;

		pending.push( assignAttributeAccessor( attributes[ gltfAttributeName ], threeAttributeName ) );

	}

	if ( primitiveDef.indices !== undefined && ! geometry.index ) {

		const accessor = parser.getDependency( 'accessor', primitiveDef.indices ).then( function ( accessor ) {

			geometry.setIndex( accessor );

		} );

		pending.push( accessor );

	}

	assignExtrasToUserData( geometry, primitiveDef );

	computeBounds( geometry, primitiveDef, parser );

	return Promise.all( pending ).then( function () {

		return primitiveDef.targets !== undefined
			? addMorphTargets( geometry, primitiveDef.targets, parser )
			: geometry;

	} );

}

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// // import { GLTFLoader } from 'fish';
//
// export const loaders = {
//   a: function() {
//     console.log("skdffgdkg");
//   },
// }
//




const loaders = {

  loading: true,
  loadingModel : true,
  loadingTexture: true,

  gltfLoader : new GLTFLoader(),
  textureLoader : new TextureLoader(),
  // these are by id as threejs keeps a unique id
  // texturesCache: {},
  texturesCache: new CheapPool(),
  texturesUrlCache: {},
  // well use url as name
  registerTexture(name, tex){
    // this.texturesCache[tex.id] = tex;
    // this.texturesCache[name] = tex;
    this.texturesCache.add({
      name: name,
      item: tex
    });
    this.texturesUrlCache[name] = model;
  },

  // unprocesed models
  // modelsCache: {},
  modelsCache: new CheapPool(),
  modelsUrlCache : {},
  // well use url as name
  registerModel(name, model){
    // this.modelsCache[model.id] = model;
    // this.modelsCache[name] = model;
    this.modelsCache.add({
      name: name,
      item: model
    });
    this.modelsUrlCache[name] = model;
  },

  // const cache = {}

  loadGLBs(urls) {
    return Promise.all(
      urls.map((url) => {
        // if (this.modelsCache[url]) return Promise.resolve(this.modelsCache[url]);
        return new Promise((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => {
            // cache[url] = gltf;
            // debugger
            this.registerModel(url, gltf);
            resolve(gltf);
          }, undefined, (error) => reject(error));
        });
      })
    );
  },

  // need RGBELoader for hdr
  loadTextures(urls) {
    return Promise.all(
      urls.map((url) => {
        // if (this.texturesCache[url]) return Promise.resolve(this.texturesCache[url]);
        return new Promise((resolve, reject) => {
          this.textureLoader.load(url, (texture) => {
            // cache[url] = texture;
            this.registerTexture(url, texture);
            // debugger
            resolve(texture);
          }, undefined, (error) => reject(error));
        });
      })
    );
  }

  // export function getCachedObject(name) {
  //   return cache[name];
  // }


};

const APP = {

  loaders : loaders,

  container: null,// ????
  scene : null,
  camera: null,
  renderer : null,
  domElement : null,

  clock: new Clock(),// T: Clock

  orbitControls: null, // T : OrbitControls

  narfs : 2,


  // stacks & grapths

  loadingStack: new CheapPool(),
  // gameLoopHooks: new CheapPool(),
  animationStack: new CheapPool(),
  sceneGrapth: new CheapPool(),
  raycastingGraph: new CheapPool(),





  shoeModels : new CheapPool(),

  defaultEnvironment : null,

  hitpointSphere: null,

  // timers : {
  //   down: 0,
  //   startDown : 0,
  //   pointerDownClock : new Clock(),
  //   pointer
  // },

  xr : {
    tempPosition : new Vector3(),
    currentModel: null, // say, the shoe model for example
    IS_XR_AVAIL : false,
    onStartButton: function() {},
    // this is a the WebXR frame from render()
    deltaFrame : new DeltaFrame(),
    renderLoopHook: null, // function
    xrLight: null,
    hitTestSource: null,
    hitTestSourceRequested : false,
    planeFound : false,
    controller : null, // T : renderer.xr.getController
    reticle: null, // Mesh
  },

  // modes

  // reworking
  // caches
  // shoesCache : [], // T : [Mesh]
  // selectablesCache : [], // [Meshes]
  // addShoe(shoe){
  //   this.shoesCache.push(shoe);
  //   this.selectablesCache.push(shoe);
  // },
  // addSelectable(shoe){
  //   this.selectablesCache.push(shoe);
  // },

  fish : null,
  modelLoaded : false,
  gltfFlower: null, // Mesh

  onConsole: null,




  // as axis y being up the floor
  grids: {
    x:null,
    y:null,
    z:null,
    toggle(val){
      if(this.x)this.x.visible = val;
      if(this.y)this.y.visible = val;
      if(this.z)this.z.visible = val;
    }
  },


  // touch event logics
  // moved to touchSystem
  // IS_DOWN : false,
  // IF_MULTITOUCH_DOWN : false,
  // touchesCount : 0,

  raycasterCube: null, // T : Mesh
  // these are for the raycast hit testing
  selectorBoxHelper : null, // box3Helper Object3D
  selectorBoxHelper2 : null, // box3Helper Object3D
  box : null, // let box = new Box3();
  box2 : null, // let box = new Box3();

  rollyControllers : [],
  selectedObjects : [],

  // displayBoxes: [],

  debugSettings : {
    // showWorldPlane : false,
    // showGridPlane : false,
    // showMousePlane : false,
    // showMouseBox : false,
    // forceReticleDesktop: false,
    // showShadowPlane : false

    showWorldPlane : true,
    showGridPlane : true,
    showMousePlane : true,
    showMouseBox : true,
    forceReticleDesktop: true,
    showShadowPlane : true
  },

  // is a mesh that shows shadows
  shadowPlane : null,

  // Helper functions
  // to make it easy to just toss into the system
  // for interactions and animations
  // addObject3D(item){
  // just DONT do scene.add() cause that will breaks all parent models
  addObject3D(item){
    this.sceneGrapth.add(item);
    // this.animationStack.add(item);
    this.raycastingGraph.add(item);
  }

};

// might just be better to clone the material but it eats more datas
// textures cloning is not a good idea

class MaterialProxy {
// export class MaterialData {
  color = new Color(1,1,1);
  emissive = new Color(0,0,0);
  store = null;

  constructor({store,name = "", color, colorHex, emissive, emissiveHex, roughness = 0, metalness = 0.5, map = null, renderOrder = 0}) {
    this.name = name;
    if(color) this.color.copy(color);
    if(colorHex) this.color.setHex(colorHex);
    this.roughness = roughness;
    this.metalness = metalness;
    if(emissive) this.emissive.copy(emissive);
    if(emissiveHex) this.emissive.setHex(emissiveHex);
    this.map = map;
    this.renderOrder = renderOrder;
    this.store = store;
  }

  copyMaterial(mat){
    this.name = mat.name;
    this.color.copy(mat.color);
    this.roughness = mat.roughness || 0;
    this.metalness = mat.metalness || 0;
    this.emissive.copy(mat.emissive);
    // this.renderOrder = mat.renderOrder;
    // map is the name for texture prop in threejs
    // debugger
    if (mat.map) {
      this.store.registerTexture(mat.map);
      this.map = mat.map;
    }
  }
  // @mat : type Material to mutate
  applyToMaterial(mat){
    // debugger
    mat.color.copy(this.color);
    mat.emissive.copy(this.emissive);
    mat.roughness = this.roughness;
    mat.metalness = this.metalness;
    mat.renderOrder = this.renderOrder;
    mat.map = this.map;
    // debugger
    if (mat.parentPointer) {
      // debugger
      mat.parentPointer.renderOrder = this.renderOrder;
      console.log("this.renderOrder", this.renderOrder);
    }

    // just mashing this in here for now cause its pretty
    console.log("// just mashing this in here for now cause its pretty");
    mat.metalness = 0.5;
    mat.roughness = 0.04;
  }
}

let rect;
const localPointer = new Vector2();
new Vector2();

const raycaster = new Raycaster();

// 2D as Cartesian
function getMousePositionToScreen(xx,yy, domElement, vector2In){
  rect = domElement.getBoundingClientRect();
              // if ( testIfMobile() ) {
              //   // vector2In.set( ( ev.touches[0].pageX / window.innerWidth ) * 2 - 1, - ( ev.touches[0].pageY / window.innerHeight ) * 2 + 1 );
              //   vector2In.x = ( ( ev.touches[0].pageX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
              //   vector2In.y = - ( ( ev.touches[0].pageY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
              // }
              // else {
              //   // vector2In.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
              //   vector2In.x = ( ( ev.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
              //   vector2In.y = - ( ( ev.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
              // }

  // this only handles 1 pointer for now
  // vector2In.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
  vector2In.x = ( ( xx - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
  vector2In.y = - ( ( yy - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;


}




// blegh 6 arguments
// this mutates the vector3in to give a position to use
// raycasterCube.position.copy(vector3in);
function getPositionOfRaycasterFromFloor({domElement, ev, camera, floorPlane, vector3in}){
  // if ( testIfMobile() ) {
  //   vectortempppp.x = ev.touches[0].pageX;
  //   vectortempppp.y = ev.touches[0].pageY;
  // }
  // else {
  //   vectortempppp.x = ev.pageX;
  //   vectortempppp.y = ev.pageY;
  // }

  getMousePositionToScreen(ev.clientX, ev.clientY, domElement,  localPointer);
  // getMousePositionToScreen(vectortempppp.x, vectortempppp.y, domElement,  localPointer);

  // debugger
  raycaster.setFromCamera( localPointer, camera );
  raycaster.ray.intersectPlane ( floorPlane, vector3in);

  // example of use
  // raycasterCube.position.copy(targetVecOfPlane);
  // return targetVecOfPlane;
}


const rayVec27 = new Vector3();
// testing where floor goes for now
// const floorPlane = new Plane(new Vector3(0,1,0), 0);
const _floorPlane = new Plane(new Vector3(1,0,0), 0);

// this is getPositionOfRaycasterFromFloor just less setup
// also .copy() the results
function getRayPosFloor(store, ev, floorPlane) {
  getPositionOfRaycasterFromFloor(
    {domElement:store.renderer.domElement,
      ev:ev,
      camera: store.camera,
      floorPlane: floorPlane || _floorPlane,
      vector3in: rayVec27
    }
  );
  return rayVec27;
}

const pointer2D = new Vector2();
// const deltaPos2D = new Vector2();
new Vector3();
const targetVector = new Vector3();

new Raycaster();

const worldPos = new Vector3();

var _this;

var bb = 0;

class RollyController extends EventDispatcher {

  attachedObject = null; // Object3d

  plane = new Plane(new Vector3(0,1,0), 0);

  startPosition = new Vector3();

  renderer = null;
  domElement = null;
  camera = null;
  scene = null;

  useDebugMode = false;
  planeObject = null;

  constructor(renderer, camera, scene){

    super();

    _this = this;

    this.renderer = renderer;
    this.domElement = renderer.domElement;
    this.camera = camera;
    this.scene = scene;

    this.planeObject = new PlaneHelper( this.plane, 0.2, 0xffff00 );
    this.planeObject.visible = false;
    this.scene.add( this.planeObject );
  }

  attach(wobject){

    this.attachedObject = wobject;
    this.startPosition.copy(wobject.position);

    // if ( testIfMobile() ){
    //  renderer.domElement.addEventListener("touchmove", this.onPointerMove);
    // }
    // else {
    //  this.domElement.addEventListener("mousemove", this.onPointerMove);
    // }

    // todo: this is hard coded
    const mm = document.getElementById("rootlike");
    mm.addEventListener( 'pointermove', this.onPointerMove );


    wobject.updateMatrixWorld();
    // wobject.parent.updateMatrixWorld();

    wobject.getWorldPosition(worldPos);

    // console.log("worldPos", worldPos);

    this.plane.set(wobject.up,0); // not sure this is world up, docs are not clear

    // this.plane.translate(wobject.position); // this is not checking for world position yet
    // console.log("wobject.position", wobject.position);
    // this.plane.translate(worldPos);
    this.plane.translate(wobject.position);
    // this.plane.translate(new Vector3(1,1,1));
    // this.plane.constant = 1;

    if(this.useDebugMode) {
      // this.scene.remove(this.planeObject);
      // this.planeObject = new PlaneHelper(this.plane, 0.2, 0x00ffff);
      // this.scene.add(this.planeObject);
      this.planeObject.visible = true;
      this.planeObject.updateMatrixWorld(true);
    }

    _this.dispatchEvent( { type: 'attach', object: _this.attachedObject } );


  }
  release(){
    this.attachedObject = null;

    // this.domElement.removeEventListener( 'pointermove', this.onPointerMove );

    // todo Hard coded dom element
    const mm = document.getElementById("rootlike");
    mm.removeEventListener( 'pointermove', this.onPointerMove );

    // if ( testIfMobile() ){
    //  renderer.domElement.removeEventListener("touchmove", this.onPointerMove);
    // }
    // else {
    //  this.domElement.removeEventListener("mousemove", this.onPointerMove);
    // }

    this.planeObject.visible = false;

		_this.dispatchEvent( { type: 'release', object: _this.attachedObject } );

  }


  onPointerMove(ev){
    // console.log("rollllly");

    // // we dont actually need testIfMobile for one touch
    // if ( testIfMobile() ) {
    //   pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
    // }
    // else {
    //   pointer2D.set(ev.pageX, ev.pageY);
    // }

    bb++;
    _o.onConsole.log("sdjkfdrg", "sdjkfdrg " + bb+" ¿?");

    pointer2D.set(ev.clientX, ev.clientY);


    // _o.onConsole.log("handleWhileDown333", "handleWhileDown333");

    // deltaPos2D.subVectors(pointer2D, this.startPosition);


    // if ( this.attachedObject ) {
    //   pointer3D.copy(_o.horseys[0].position);
    //   deltaPos3D.set(deltaPos2D.x, _o.horseys[0].position.y, deltaPos2D.y);
    //   _o.horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    //   // console.log("deltaPos3D", deltaPos3D);
    // }

    // raycasterCube
    getPositionOfRaycasterFromFloor({domElement: _this.domElement, ev:ev, camera: _this.camera, floorPlane: _this.plane, vector3in: targetVector});
    _o.raycasterCube.position.copy(targetVector);

    // _this.attachedObject.position.copy(targetVector).sub(_this.startPosition);
    _this.attachedObject.position.copy(targetVector);



    _this.dispatchEvent( { type: 'pointerMove', object: _this.attachedObject } );



                      //
                      //
                      //
                      // // _o.onConsole.log("handleWhileDown444", "handleWhileDown444");
                      //
                      //
                      // // debugger visulizer
                      // // makeCubey(0.01, scene); this here breaks it, so something is missing
                      // // so instead we just spam the cube below
                      //
                      // // return;
                      // console.log("dkfgdfg");
                      //
                      // _o.onConsole.log("othercount", ev.touches.length );
                      //
                      // _o.touchesCount = ev.touches.length;
                      // if (testIfMobile() && ev.touches.length > 1) {
                      //   _o.IF_MULTITOUCH_DOWN = true;
                      //   _o.onConsole.log("handleWhileDown555rrr", "handleWhileDown555rrr" );
                      //
                      // }
                      //
                      // // _o.onConsole.log("handleWhileDown555", "handleWhileDown555");
                      //
                      // _o.onConsole.log("IF_MULTITOUCH_DOWN", "multi is not");
                      //
                      // if(_o.IF_MULTITOUCH_DOWN === true){
                      //   const cc = makeCubey(0.01, _o.scene, 0x00ffff);
                      //
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWNaaa", "IF_MULTITOUCH_DOWN aaa");
                      //
                      //   _o.deltaFrame.poseMatrix.decompose(cc.position, cc.quaternion, cc.scale);
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWNbbb", "IF_MULTITOUCH_DOWN bbb");
                      //   cc.rotation.y = 1.1;
                      //   cc.rotation.z = 0.4;
                      //   const s = 0.01;
                      //   cc.scale.set(s,s,s);
                      //
                      //   _o.onConsole.log("IF_MULTITOUCH_DOWN", "is DOWN");
                      //
                      // }
                      // else {
                      //   _o.IF_MULTITOUCH_DOWN = false;
                      // }
                      //
                      // _o.onConsole.log("handleWhileDown555bbb", "handleWhileDown555bbb");
                      //

  }

//
// start
//
//   				this.object.updateMatrixWorld();
//   				this.object.parent.updateMatrixWorld();
//
// 				this._positionStart.copy( this.object.position );
//
//
//         				this.pointStart.copy( planeIntersect.point ).sub( this.worldPositionStart );
//
//                 move
//   const planeIntersect = intersectObjectWithRay( this._plane, _raycaster, true );
//
//   if ( ! planeIntersect ) return;
//
//   this.pointEnd.copy( planeIntersect.point ).sub( this.worldPositionStart );
//
//
//   this._offset.copy( this.pointEnd ).sub( this.pointStart );
//
//
//   object.position.copy( this._offset ).add( this._positionStart );

}

const touchEventsData = {


  touchStartPos : new Vector2(0,0),
  pointer2D : new Vector2(0,0),
  deltaPos2D : new Vector2(0,0),
  deltaPos3D : new Vector3(0,0,0),
  pointer3D : new Vector3(0,0,0),
  // memPointerDown3D : new Vector3(0,0,0),
  // horseyPosDown : new Vector3(0,0,0),

  pointerDownClock : new Clock(),
  memPointer2D : new Vector2(0,0),
  memPointer2D_Up : new Vector2(0,0),
  tempDrag : new Vector2(0,0),

  raycaster : new Raycaster(),
  targetVecOfPlane : new Vector3(),
  floorPlane : new Plane(new Vector3(0,1,0), 0),


  selectedObject : null,
  IS_DOWN : false,
  hasStartedDrag : false,

  IF_MULTITOUCH_DOWN : false,
  touchesCount : 0,
  touchType : "-1",

  // not sure about this yet
  shouldNotOrbitOnTouchDown : true,
  shouldOrbitOnPointerUp : true,

  pickingArray : [],

  // none, drag_xz, drag_y
  controlMode: "none",


};

// import { Vector3 } from "../Modules/Vector3.js";
// import { Vector2 } from "../Modules/Vector2.js";

class OnScreenLogger{
  static instance = null;


  // _element = null;

  constructor(element){
    if (OnScreenLogger.instance) {
      return OnScreenLogger.instance;
    }

    this.items = {};
    this.logger = document.createElement("div");
    this.logger.id = "OnScreenLoggerlogger";

    var st = this.logger.style;
    st.id = "OnScreenLoggerlogger";
    st.position = "absolute";
    st.zIndex = "100";
    st.right = "0";
    st.top = "0";
    st.padding = "10px";
    st.color = "#ffffff";
    st.fontSize = "14px";
    st.maxWidth = "500px";
    st.pointerEvents = "none";
    // -moz-user-select: none;
    // -webkit-user-select: none;
    // -ms-user-select: none;
    // user-select: none;
    // pointer-events: none;

    if (element) {
      element.appendChild(this.logger);
    }
    else {
      const existingLogger = document.getElementById(this.logger.id);
      if (!existingLogger) {
        document.body.appendChild(this.logger);
      }
    }

    OnScreenLogger.instance = this;



  }

  createItem(name){
    var text1 = document.createElement("p");
    text1.id = name;
    this.logger.appendChild(text1);
    text1.innerText = "??";

    return {
      name : name,
      text : text1,
      messages : []
    }
  }

  // called like traditional console.log()
  log(name, ...vals){

    if (this.items[name] === undefined) {
      this.items[name] = this.createItem(name);
    }

    this.items[name].messages = vals;

    var tt = "";
    for (const item of vals) {
      tt += item + ", ";
    }
    tt = tt.substring(0, tt.length - 2);

    this.items[name].text.innerText = name + " : " + tt;

  }

  wrapLog(name, wobject){
    setInterval( () =>{
      this.log(name, wobject );

    }, 2);
  }


}

function onConsole(name, ...vals) {
  const logger = new OnScreenLogger();
  logger.log(name, ...vals);
}

function ball({store, color = 0xcc44ff, scale = 0.01}={}){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: color } );
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(scale);
  if(store){
    store.scene.add(sphere);
  }
  return sphere;
}

let _ball = null;

const floorPlane = new Plane(new Vector3(0,1,0), 0);

const originStartPos = new Vector3();
let hasStartedMove = false;
const memPointerDown3D = new Vector3(0,0,0);
const starterOffset = new Vector3(0,0,0);
// const mVV = new Vector3(0,0,0);

let _selectedObject;

const calcPath = new Vector3();
const dragLimit = 0.5;


const tPosition$1 = new Vector3();
const tScale$1 = new Vector3();
const tRotation$1 = new Quaternion();

// At this time this whole routine is just a move tool
// and should be moved into some kinda mode tool
function handlePointerMove(ev) {

  // :Shoe horned XR demo
  if(APP.xr.IS_XR_AVAIL){
    if (APP.xr.reticle.visible) {
      const _ball = ball({store:APP, color: 0xffffff});
      // _ball.position.copy(_o.xr.reticle.position)
      // this is a non obvious annoying way to get the XR anchors position
      APP.xr.reticle.matrix.decompose(tPosition$1, tRotation$1, tScale$1);
      _ball.position.copy(tPosition$1);

    }
  }


  const vv = getRayPosFloor(APP, ev, floorPlane);

  // console.log("¿¿¿¿");
  // const _ball = ball({store:_o, color: 0xffffff})
  // _ball.position.copy(vv)

  // instead of spamming start event, do once check
  if (touchEventsData.IS_DOWN && hasStartedMove === false && touchEventsData.selectedObject) {
    hasStartedMove = true;
    // is this a loop???!?!?!?!?!?¿¿¿¿!⁄????≥÷
    // carry on

    // set the visual true selected
    _selectedObject = touchEventsData.selectedObject;
    if(touchEventsData.selectedObject.isRoot === false && touchEventsData.selectedObject.rootObject){
      _selectedObject = touchEventsData.selectedObject.rootObject;
    }

    originStartPos.copy(_selectedObject.position);
    memPointerDown3D.copy(vv);
    if(_selectedObject){
      starterOffset.copy(_selectedObject.position).sub(vv);
    }
  }
  // reseters
  if ( !touchEventsData.IS_DOWN ) {
    hasStartedMove = false;
    starterOffset.set(0,0,0);
    memPointerDown3D.set(0,0,0);
    originStartPos.set(0,0,0);
  }

  // onConsole("floorvec", vv.x, vv.y, vv.z);
  if(!_ball){
    _ball = ball({store:APP, color: 0xffffff});
  }
  _ball.position.copy(vv);

  // handle transforming on plane offset
  if (_selectedObject && touchEventsData.IS_DOWN && APP.orbitControls.enabled === false) {

    // console.log("vv", vv, _selectedObject);
    // basic solution to not move the nav bubbles
    if(_selectedObject.isRoot){
      const len = originStartPos.distanceTo(vv);
      onConsole("len", len);

      calcPath.copy(vv).sub(originStartPos);//.add(starterOffset)

      if (calcPath.length() > dragLimit) {
        // too harsh
        // vv.copy(mVV);
        // better, does not lock movement
        // but could use a spring effect
        calcPath.setLength(dragLimit);
      }
      calcPath.add(originStartPos).add(starterOffset);

      // turn off for now
      // this trucks the model on the XZ plane
      // not working right in AR
              // _selectedObject.position.copy(calcPath);

    }

  }

}

// instant point down array building
function trySelector(ev) {
  touchEventsData.selectedObject = null;
  touchEventsData.pickingArray.length = 0;

  // getPositionOfRaycasterFromFloor(
  //   {domElement:_o.renderer.domElement,
  //     ev:ev,
  //     camera: _o.camera,
  //     floorPlane:floorPlane,
  //     vector3in: _e.targetVecOfPlane
  //   }
  // );

  getMousePositionToScreen(touchEventsData.touchStartPos.x, touchEventsData.touchStartPos.y, APP.domElement, touchEventsData.pointer2D);
  touchEventsData.raycaster.setFromCamera( touchEventsData.pointer2D, APP.camera );



  for (var gg = 0; gg < APP.raycastingGraph.length; gg++) {
    // fills the pickingArray
    touchEventsData.raycaster.intersectObjects(APP.raycastingGraph, false, touchEventsData.pickingArray);
    // if(_e.pickingArray.length > 0){
    //   _e.thirdArray = _e.pickingArray.slice();
    // }
  }
  if (touchEventsData.pickingArray.length > 0) {
    if(APP.hitpointSphere){
      APP.hitpointSphere.position.copy(touchEventsData.pickingArray[0].point);
      APP.hitpointSphere.visible = true;
    }

    touchEventsData.selectedObject = touchEventsData.pickingArray[0]?.object;

    // _e.selectedObject = _e.firstArray[0];
    // where the picked is the hidden picking mesh instead
    if(touchEventsData.selectedObject.isRoot === false && touchEventsData.selectedObject.rootObject);


    // moved to Up to act as a tap event
    // do we need try catch??
    // try {

      // instant onTap
      // _e.pickingArray[0]?.object?.onTap();

      // Simulate bubbling of the click event, requires model setup
      // const onTapEvent = { type: 'onTap' };
      // _e.pickingArray[0].object.dispatchEvent(onTapEvent);
      // propagateEventAsync(onTapEvent, _e.pickingArray[0].object);

    // }
    // catch(ee){
    //   console.log("ee", ee);
    // }

  }



}

// this is too harsh
// it defeats a flick gesture
function testOrbitControlsToggle(val) {
  if (val === "on") {
    if (touchEventsData.shouldOrbitOnPointerUp && APP.orbitControls) {
      APP.orbitControls.enabled = true;
    }
  }
  else if(val === "off"){
    if(touchEventsData.shouldNotOrbitOnTouchDown && touchEventsData.selectedObject){
      APP.orbitControls.enabled = false;
    }
  }
}

// line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})

function line({p0,p1, color = 0xff00ff, size = 0.5, scene  }) {

  const path = new LineCurve3(p0,p1);

  const geometry = new TubeGeometry( path, 1, size, 2, false );
  const material = new MeshBasicMaterial( { color: color } );
  const mesh = new Mesh( geometry, material );
  scene.add( mesh );

  return mesh;

}

new Raycaster();


const tPosition = new Vector3();
const tScale = new Vector3();
const tRotation = new Quaternion();
const p0 = new Vector3();
new Vector3();



function handleTouchStart(ev) {
  ev.preventDefault();

  touchEventsData.IS_DOWN = true;
  testOrbitControlsToggle("on");

  console.log("start");

  touchEventsData.touchType = ev.pointerType;

  // for the tap event
  touchEventsData.pointerDownClock.start();
  touchEventsData.memPointer2D.set(ev.clientX, ev.clientY);

  touchEventsData.touchStartPos.x = ev.clientX;
  touchEventsData.touchStartPos.y = ev.clientY;

  // updateRaycasts(ev);
  trySelector();

  // after trySelector if we have an object, lets NOT orbit
  // guess...., thinking
  testOrbitControlsToggle("off");


  // store.xr.controller = store.renderer.xr.getController(0);

// Messssss start
//
// onConsole("IS_XR_AVAIL ?? : ", _o.xr?.IS_XR_AVAIL)
// onConsole("xr isPresenting ? : ", _o?.renderer?.xr?.isPresenting)
//
// const cameras = _o.renderer?.xr?.getCamera()?.cameras;
// const camlen = cameras ? cameras.length : 0;
// const controller = _o.renderer?.xr?.getController(0);
//
// onConsole("controller.type : ", controller?.type)
// let count = controller.children.length;
// onConsole("controller count : ", count)
//
//

//
// try {
//   // children
//   let i = 0;
//   controller.traverse( ( item ) => {
//     onConsole(`item.type : ${i}`, item?.type);
//     i++;
//   });
// } catch (e) {
//   console.log(e);
// }


//
// onConsole("camlen : ", camlen)
// onConsole("cam world auto: ", _o.camera.matrixWorldAutoUpdate)
//

// const tempMatrix = new Matrix4();
// const camPosition = new Vector3();
// const camPositionMat111 = new Vector3();
// camPositionMat111.setFromMatrixPosition(_o.camera.matrixWorld)
// onConsole("camPositionMat111 : ", camPositionMat111.toArray())
//
// const camWorldVecPos111 = new Vector3();
// _o.camera.getWorldPosition(camWorldVecPos111)
// onConsole("camWorldVecPos111 : ", camWorldVecPos111.toArray())
//
// if (cameras && cameras.length > 0) {
//   const camPositionMat222 = new Vector3();
//   camPositionMat222.setFromMatrixPosition(cameras[0].matrixWorld)
//   onConsole("camPositionMat222 : ", camPositionMat222.toArray())
//
//   const camWorldVecPos222 = new Vector3();
//   cameras[0].getWorldPosition(camWorldVecPos222)
//   onConsole("camWorldVecPos222 : ", camWorldVecPos222.toArray())
//
// }


// store.xr.controller = store.renderer.xr.getController(0);
//
//   // if(_o.xr?.controller){
//   if(_o.xr?.IS_XR_AVAIL){
//
//     // onConsole("is IS_XR_AVAIL 111")
//
// // vector3.setFromMatrixPosition
//   // tempMatrix.identity().extractRotation(store.xr.controller.matrixWorld);
//
//   getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.domElement, _e.pointer2D);
//   // _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );
//   _e.raycaster.setFromCamera( _e.pointer2D, _o.renderer.xr.getCamera().cameras[0] );
//   // raycaster.ray.origin.
//   // debugger
//   p0.copy(_e.raycaster.ray.origin)
//   p1.copy(_e.raycaster.ray.direction).setLength(4).add(p0)
//
//   // line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})
//   line({p0: p0, p1: p1, size: 0.005, scene: _o.scene, color: 0x00ffff})
//   onConsole("is IS_XR_AVAIL 222")
//
// }
// else{
//   onConsole("is IS_XR_AVAIL 333")
//
//   getMousePositionToScreen(_e.touchStartPos.x, _e.touchStartPos.y, _o.domElement, _e.pointer2D);
//   _e.raycaster.setFromCamera( _e.pointer2D, _o.camera );
//   // debugger
//   p0.copy(_e.raycaster.ray.origin)
//   p1.copy(_e.raycaster.ray.direction).setLength(4).add(p0)
//
//   // line({p0:new Vector3(0,0,0), p1: new Vector3(2,2,2), size: 0.02, scene: _o.scene, color: 0x00ffff})
//   line({p0: p0, p1: p1, size: 0.005, scene: _o.scene, color: 0x00ffff})
// }



if(APP?.renderer?.xr?.isPresenting){
    line({p0: p0.set(0,0,0), p1: APP.xr.tempPosition, size: 0.005, scene: APP.scene, color: 0x00ffff});
}



// Messssss stop

  // onConsole("fish", 4)

  // SOMEWHERE the reticle updates
  // so well just use its position
  // :Shoe horned XR demo

  // onConsole("IS_XR_AVAIL", _o.xr.IS_XR_AVAIL)
  // onConsole("visible", _o.xr?.reticle?.visible)
  // onConsole("currentModel", _o.xr?.currentModel !== null)

  if(APP.xr.IS_XR_AVAIL){
    // onConsole("try model tap -222")
    if (APP.xr?.reticle.visible) {
      // const _ball = ball({store:_o, color: 0xffffff})
      // _ball.position.copy(_o.xr.reticle.position)
      // :shoe horning XR in here
      // if (_o.xr.IS_XR_AVAIL && _o.xr.currentModel && _o.xr.reticle.visible) {
      // onConsole("try model tap -111")
      if (APP.xr?.currentModel) {
        // onConsole("try model tap 111")
        APP.xr.reticle.matrix.decompose(tPosition, tRotation, tScale);
        // onConsole("tPosition aaa", tPosition.x, tPosition.y, tPosition.z)
        onConsole("try model tap 222");
        // onConsole("model name", _o.xr?.currentModel?.name)
        // onConsole("model", _o.xr?.currentModel)

        APP.xr.currentModel.position.copy(tPosition);
        // if (_o.xr.currentModel.physics.session) {
        if (APP.xr.currentModel.onAppear) {
          APP.xr.currentModel.onAppear();
        }
        if (APP.xr.currentModel.physics?.replay) {
          // _o.xr.currentModel.physics.session.start();
          APP.xr.currentModel.physics.replay();
        }

        // onConsole("try model tap 333")

        // onConsole("tPosition bbb", tPosition.x, tPosition.y, tPosition.z)

      }

    }
  }

}

// ------------------------------
function handleTouchStop(ev) {
  ev.preventDefault();

  // _o.onConsole.log("isdown2", "isdown2 no");

  console.log("touch stop");
  const tapspeed = 0.5;
  const distanceMax = 12;

  if (touchEventsData.selectedObject && touchEventsData.IS_DOWN) {

    const delta = touchEventsData.pointerDownClock.getElapsedTime();
    // onConsole("delta", delta);

    touchEventsData.memPointer2D_Up.set(ev.clientX, ev.clientY);
    let dis = touchEventsData.memPointer2D.distanceTo(touchEventsData.memPointer2D_Up);

    // console.log("dis", dis);

    // onConsole("dis", dis);

    onConsole("tap 1");
    if (delta <= tapspeed && dis <= distanceMax) {
      console.log("Tap!!");
      onConsole("tap 2");

      // should this handle rootObject instead of selectorMesh?
      // its fine now, it bubbles
      if (touchEventsData.selectedObject?.onTap) {
        onConsole("tap 3");
        touchEventsData.selectedObject?.onTap();
      }
    }
  }

  touchEventsData.IS_DOWN = false;
  touchEventsData.hasStartedDrag = false;


  testOrbitControlsToggle("on");

}

function hemisphereLight(scene,{
  skyColor = 0xffffff,
  groundColor = 0xffffff,
  intensity = 2,
  position = { x: 0, y: 50, z: 0 },
  helperSize = 10
}={}) {
  const hemiLight = new HemisphereLight(skyColor, groundColor, intensity);
  hemiLight.color.setHSL(0.6, 1, 0.6);  // Optional: customizable via arguments
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);  // Optional customization
  hemiLight.position.set(position.x, position.y, position.z);
  scene.add(hemiLight);

  if (helperSize > 0) {
    const hemiLightHelper = new HemisphereLightHelper(hemiLight, helperSize);
    scene.add(hemiLightHelper);
  }
  return hemiLight;
}

function setupXR(store, {win, fail}={}) {

  onConsole("testing XR");

  // check for webxr session support
  if ("xr" in navigator) {
    // console.log("maybe XR");
    onConsole("maybe XR");

    navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
      if (supported) {
        console.log("YES XR");
        onConsole("YES XR");

        //hide "ar-not-supported"
        // document.getElementById("ar-not-supported").style.display = "none";
        // _o.onConsole.log("preinit");

        // init();
        // animate();
        // setupXRLighting();
        store.xr.IS_XR_AVAIL = true;
        store.renderer.xr.enabled = true;
        // store.renderer.xr.addEventListener("sessionstart", sessionStart);



        if (win) {
          win();
        }

      }
      else {
        // // run these here to debug otherwise run them in the above if
        // init();
        // animate();
        console.log("NO XR");
        onConsole("NO XR nada");
        if(fail){
          fail();
        }
      }
    });
  }


}

class SessionLightProbe {

	constructor( xrLight, renderer, lightProbe, environmentEstimation, estimationStartCallback ) {

		this.xrLight = xrLight;
		this.renderer = renderer;
		this.lightProbe = lightProbe;
		this.xrWebGLBinding = null;
		this.estimationStartCallback = estimationStartCallback;
		this.frameCallback = this.onXRFrame.bind( this );

		const session = renderer.xr.getSession();

		// If the XRWebGLBinding class is available then we can also query an
		// estimated reflection cube map.
		if ( environmentEstimation && 'XRWebGLBinding' in window ) {

			// This is the simplest way I know of to initialize a WebGL cubemap in Three.
			const cubeRenderTarget = new WebGLCubeRenderTarget( 16 );
			xrLight.environment = cubeRenderTarget.texture;

			const gl = renderer.getContext();

			// Ensure that we have any extensions needed to use the preferred cube map format.
			switch ( session.preferredReflectionFormat ) {

				case 'srgba8':
					gl.getExtension( 'EXT_sRGB' );
					break;

				case 'rgba16f':
					gl.getExtension( 'OES_texture_half_float' );
					break;

			}

			this.xrWebGLBinding = new XRWebGLBinding( session, gl );

			this.lightProbe.addEventListener( 'reflectionchange', () => {

				this.updateReflection();

			} );

		}

		// Start monitoring the XR animation frame loop to look for lighting
		// estimation changes.
		session.requestAnimationFrame( this.frameCallback );

	}

	updateReflection() {

		const textureProperties = this.renderer.properties.get( this.xrLight.environment );

		if ( textureProperties ) {

			const cubeMap = this.xrWebGLBinding.getReflectionCubeMap( this.lightProbe );

			if ( cubeMap ) {

				textureProperties.__webglTexture = cubeMap;

				this.xrLight.environment.needsPMREMUpdate = true;

			}

		}

	}

	onXRFrame( time, xrFrame ) {

		// If either this obejct or the XREstimatedLight has been destroyed, stop
		// running the frame loop.
		if ( ! this.xrLight ) {

			return;

		}

		const session = xrFrame.session;
		session.requestAnimationFrame( this.frameCallback );

		const lightEstimate = xrFrame.getLightEstimate( this.lightProbe );
		if ( lightEstimate ) {

			// We can copy the estimate's spherical harmonics array directly into the light probe.
			this.xrLight.lightProbe.sh.fromArray( lightEstimate.sphericalHarmonicsCoefficients );
			this.xrLight.lightProbe.intensity = 1.0;

			// For the directional light we have to normalize the color and set the scalar as the
			// intensity, since WebXR can return color values that exceed 1.0.
			const intensityScalar = Math.max( 1.0,
				Math.max( lightEstimate.primaryLightIntensity.x,
					Math.max( lightEstimate.primaryLightIntensity.y,
						lightEstimate.primaryLightIntensity.z ) ) );

			this.xrLight.directionalLight.color.setRGB(
				lightEstimate.primaryLightIntensity.x / intensityScalar,
				lightEstimate.primaryLightIntensity.y / intensityScalar,
				lightEstimate.primaryLightIntensity.z / intensityScalar );
			this.xrLight.directionalLight.intensity = intensityScalar;
			this.xrLight.directionalLight.position.copy( lightEstimate.primaryLightDirection );

			if ( this.estimationStartCallback ) {

				this.estimationStartCallback();
				this.estimationStartCallback = null;

			}

		}

	}

	dispose() {

		this.xrLight = null;
		this.renderer = null;
		this.lightProbe = null;
		this.xrWebGLBinding = null;

	}

}

class XREstimatedLight extends Group {

	constructor( renderer, environmentEstimation = true ) {

		super();

		this.lightProbe = new LightProbe();
		this.lightProbe.intensity = 0;
		this.add( this.lightProbe );

		this.directionalLight = new DirectionalLight();
		this.directionalLight.intensity = 0;
		this.add( this.directionalLight );

		// Will be set to a cube map in the SessionLightProbe is environment estimation is
		// available and requested.
		this.environment = null;

		let sessionLightProbe = null;
		let estimationStarted = false;
		renderer.xr.addEventListener( 'sessionstart', () => {

			const session = renderer.xr.getSession();

			if ( 'requestLightProbe' in session ) {

				session.requestLightProbe( {

					reflectionFormat: session.preferredReflectionFormat

				} ).then( ( probe ) => {

					sessionLightProbe = new SessionLightProbe( this, renderer, probe, environmentEstimation, () => {

						estimationStarted = true;

						// Fired to indicate that the estimated lighting values are now being updated.
						this.dispatchEvent( { type: 'estimationstart' } );

					} );

				} );

			}

		} );

		renderer.xr.addEventListener( 'sessionend', () => {

			if ( sessionLightProbe ) {

				sessionLightProbe.dispose();
				sessionLightProbe = null;

			}

			if ( estimationStarted ) {

				// Fired to indicate that the estimated lighting values are no longer being updated.
				this.dispatchEvent( { type: 'estimationend' } );

			}

		} );

		// Done inline to provide access to sessionLightProbe.
		this.dispose = () => {

			if ( sessionLightProbe ) {

				sessionLightProbe.dispose();
				sessionLightProbe = null;

			}

			this.remove( this.lightProbe );
			this.lightProbe = null;

			this.remove( this.directionalLight );
			this.directionalLight = null;

			this.environment = null;

		};

	}

}

function setupXRLighting(store){

		// Don't add the XREstimatedLight to the scene initially.
		// It doesn't have any estimated lighting values until an AR session starts.

		store.xr.xrLight = new XREstimatedLight( store.renderer );

		store.xr.xrLight.addEventListener( 'estimationstart', () => {

			// Swap the default light out for the estimated one one we start getting some estimated values.
			store.scene.add( store.xr.xrLight );
      // store.scene.remove( defaultLight );

			// The estimated lighting also provides an environment cubemap, which we can apply here.
			if ( store.xr.xrLight.environment ) {

				store.scene.environment = store.xr.xrLight.environment;

			}

		} );

		store.xr.xrLight.addEventListener( 'estimationend', () => {

			// Swap the lights back when we stop receiving estimated values.
			// store.scene.add( defaultLight );
			store.scene.remove( store.xr.xrLight );

			// Revert back to the default environment.
			// store.scene.environment = defaultEnvironment;

		} );
}

function setupXRRenderLoopHook(store) {

  store.xr.renderLoopHook = function(frame, timestamp, store) {


    const _o = store;

    // if (frame && _o.modelLoaded === true) {
    if (frame) {
      const referenceSpace = _o.renderer.xr.getReferenceSpace();
      const session = _o.renderer.xr.getSession();

      if (_o.xr.hitTestSourceRequested === false) {
        session.requestReferenceSpace("viewer").then(function (referenceSpace) {
          session
            .requestHitTestSource({ space: referenceSpace })
            .then(function (source) {
              _o.xr.hitTestSource = source;
            });
        });

        session.addEventListener("end", function () {
          _o.xr.hitTestSourceRequested = false;
          _o.xr.hitTestSource = null;
        });

        _o.xr.hitTestSourceRequested = true;
      }

      if (_o.xr.hitTestSource) {

        const hitTestResults = frame.getHitTestResults(_o.xr.hitTestSource);

        if (hitTestResults.length) {

          if (!_o.xr.planeFound) {

            _o.xr.planeFound = true;
            //hide #tracking-prompt
            document.getElementById("tracking-prompt").style.display = "none";
            // document.getElementById("instructions").style.display = "flex";

          }
          const hit = hitTestResults[0];

          _o.xr.reticle.visible = true;

          const mm = hit.getPose(referenceSpace).transform.matrix;

          _o.xr.reticle.matrix.fromArray(mm);

          _o.xr.deltaFrame.poseMatrix.fromArray(mm);


          // from here we could store the matrix and frame to use within the touch events
          // instead of instancing in this function

                          // // debugger visulizer
                          // // makeCubey(0.01, scene); this here breaks it, so something is missing
                          // // so instead we just spam the cube below
                          //
                          // if(_o.IF_MULTITOUCH_DOWN){
                          //
                          //   // could cache this
                          //   const geometry = new BoxGeometry( 1, 1, 1 );
                          //   // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
                          //   const material = new MeshBasicMaterial( {color: 0x00ff00} );
                          //   const cube = new Mesh( geometry, material );
                          //   // cube.position.set(0,0,0);
                          //   _o.xr.reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
                          //   cube.rotation.y = 1.1;
                          //   cube.rotation.z = 0.4;
                          //   const s = 0.01;
                          //   cube.scale.set(s,s,s);
                          //   _o.scene.add( cube );
                          //
                          // }

          // if (SHADOW_PLANE_SETUP_AR === false) {
          //   if (shadowPlane && reticle) {
          //
          //     shadowPlane.position = reticle.position;
          //     SHADOW_PLANE_SETUP_AR = true;
          //   }
          //
          // }

        }
        else {
          _o.xr.reticle.visible = false;
        }
      }
    }
    // :D stop ar testing logics


  };
}

function addResizeWindow(store) {

  window.addEventListener('resize', () => {
    store.renderer.setSize(window.innerWidth, window.innerHeight);
    store.camera.aspect = window.innerWidth / window.innerHeight;
    store.camera.updateProjectionMatrix();
  });


}

// we might change where the function is stored later
// so decorator object !!
function animateDeco(object, funx) {
  object.userData.animate = funx.bind(object);
}

  // animateDeco(cube, function() {
  //   // console.log(this);
  //   this.rotation.x += 0.01;
  //   this.rotation.y += 0.01;
  // })

  // cube.userData.animate = function() {
  //   // console.log(this);
  //   this.rotation.x += 0.01;
  //   this.rotation.y += 0.01;
  // }.bind(cube);

// const delta = clock.getDelta();

const clock = new Clock();


// let pose;
let viewerPose;
// localSpace, baseSpace
let poseViewPosition = new Vector3();


function setupGameLoopWithFPSClamp(store, fps = 60) {
  const interval = 1000 / fps;  // Calculate the interval in milliseconds
  let preTime = 0;  // Track the time of the last frame



  function animate(timestamp, frame) {
    const deltaTime = timestamp - preTime;




    // If enough time has passed, execute the animation
    if (deltaTime > interval) {
      preTime = timestamp - (deltaTime % interval);  // Adjust preTime for smooth throttling

      if(store.xr.IS_XR_AVAIL){
        if(store?.xr?.renderLoopHook){
          store.xr.renderLoopHook(frame, timestamp, store);

          // if(false){
          if(frame){
            // pose = frame.getViewerPose( customReferenceSpace || referenceSpace );
            // pose = frame.getViewerPose( customReferenceSpace );
            // pose = frame.getViewerPose( localSpace, baseSpace );
            // this is a string
            // https://developer.mozilla.org/en-US/docs/Web/API/XRSession/requestReferenceSpace#unbounded
            const referenceSpace = store?.renderer?.xr?.getReferenceSpace();
            if (referenceSpace) {
              onConsole("referenceSpace 111", referenceSpace);
              viewerPose = frame.getViewerPose(referenceSpace);
              if (viewerPose) {
                onConsole("viewerPose 111", viewerPose);
                // .transform.matrix;
                // const mm = hit.getPose(referenceSpace).transform.matrix;
                const mm = viewerPose?.transform?.matrix;
                // onConsole("mm", mm)
                onConsole("mm was here");
                // mattostring(mm)
                if (mm) {
                  // onConsole("pose aaa")
                  // poseViewPosition.setFromMatrixPosition(mm);
                  // three expects m.elements
                  // column-major order so no transpose change needed
                  // poseViewPosition.set(mm[12], mm[13], mm[14]);
                  poseViewPosition.set(viewerPose?.transform?.position?.x, viewerPose?.transform?.position?.y, viewerPose?.transform?.position?.z);
                  // onConsole("pose bbb", poseViewPosition)
                  store.xr.tempPosition.copy(poseViewPosition);

                  onConsole("pose viewx", poseViewPosition.x.toFixed(5));
                  onConsole("pose viewy", poseViewPosition.y.toFixed(5));
                  onConsole("pose viewz", poseViewPosition.z.toFixed(5));
                }
                else {
                  onConsole("mm missing");
                }
                // store.xr.reticle.matrix.fromArray(mm);
              }
              else {
                onConsole("viewerPose missing");
              }
            }
            else {
              onConsole("referenceSpace missing");

            }

          }


        }
      }

      // requestAnimationFrame(animate);

      // for (let i = 0; i < store.animationStack.length; i++) {
      //   const aa = store.animationStack[i];
      //   if (aa.isSuperObject3D) {
      //     if (aa?.animate) {
      //      aa.animate();
      //     }
      //   }
      //   else if (aa.isObject3D) {
      //     if (aa?.userData?.animate) {
      //      aa.userData.animate();
      //     }
      //   }
      // }

      const dt = clock.getDelta();
      for (let i = 0; i < store.sceneGrapth.length; i++) {
        const aa = store.sceneGrapth[i];
        if (aa.isSuperObject3D) {
          if (aa?.animate) {
           aa.animate(deltaTime);
          }
          if (aa?.update) {
           aa.update(dt);
          }
        }
        // else if (aa.isObject3D) {
        //   if (aa?.userData?.animate) {
        //    aa.userData.animate();
        //   }
        // }
      }



      // for (let i = 0; i < store.gameLoopHooks.length; i++) {
      //   store.gameLoopHooks[i]();
      // }

      if(store.orbitControls && store.orbitControls.enableDamping){
        store.orbitControls.update();
      }

      store.renderer.render(store.scene, store.camera);
    }
    // requestAnimationFrame(animate);

  }

  store.renderer.setAnimationLoop(animate);
  // animate();

}

function init3d(store) {
  const _o = store;

  // _o.onConsole.log("init go");

  console.log("init go");

  _o.clock = new Clock();

  _o.container = document.createElement("div");
  document.body.appendChild(_o.container);
  _o.container.id = "threecontainer";


  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  _o.renderer = renderer;
  _o.domElement = renderer.domElement;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.xr.enabled = true;
  _o.container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

  // renderer.xr.addEventListener("sessionstart", sessionStart);



  const scene = new Scene();
  _o.scene = scene;
  _o.scene.name = "narfs222";


  _o.camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  // _o.camera.position.y = 0.2;
  _o.camera.position.z = 0.4;
  // _o.camera.position.x = 0.3;

}

// OrbitControls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends EventDispatcher {

	constructor( object, domElement ) {

		super();

		this.object = object;
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

		// The four arrow keys
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		// Mouse buttons
		this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

		// Touch fingers
		this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.getDistance = function () {

			return this.object.position.distanceTo( this.target );

		};

		this.listenToKeyEvents = function ( domElement ) {

			domElement.addEventListener( 'keydown', onKeyDown );
			this._domElementKeyEvents = domElement;

		};

		this.stopListenToKeyEvents = function () {

			this._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );
			this._domElementKeyEvents = null;

		};

		this.saveState = function () {

			scope.target0.copy( scope.target );
			scope.position0.copy( scope.object.position );
			scope.zoom0 = scope.object.zoom;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( _changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			const offset = new Vector3();

			// so camera.up is the orbit axis
			const quat = new Quaternion().setFromUnitVectors( object.up, new Vector3( 0, 1, 0 ) );
			const quatInverse = quat.clone().invert();

			const lastPosition = new Vector3();
			const lastQuaternion = new Quaternion();
			const lastTargetPosition = new Vector3();

			const twoPI = 2 * Math.PI;

			return function update() {

				const position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				if ( scope.enableDamping ) {

					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
					spherical.phi += sphericalDelta.phi * scope.dampingFactor;

				} else {

					spherical.theta += sphericalDelta.theta;
					spherical.phi += sphericalDelta.phi;

				}

				// restrict theta to be between desired limits

				let min = scope.minAzimuthAngle;
				let max = scope.maxAzimuthAngle;

				if ( isFinite( min ) && isFinite( max ) ) {

					if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

					if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

					if ( min <= max ) {

						spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

					} else {

						spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
							Math.max( min, spherical.theta ) :
							Math.min( max, spherical.theta );

					}

				}

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location

				if ( scope.enableDamping === true ) {

					scope.target.addScaledVector( panOffset, scope.dampingFactor );

				} else {

					scope.target.add( panOffset );

				}

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

					panOffset.multiplyScalar( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

					panOffset.set( 0, 0, 0 );

				}

				scale = 1;

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ||
					lastTargetPosition.distanceToSquared( scope.target ) > 0 ) {

					scope.dispatchEvent( _changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					lastTargetPosition.copy( scope.target );

					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

			scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
			scope.domElement.removeEventListener( 'pointercancel', onPointerUp );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel );

			scope.domElement.removeEventListener( 'pointermove', onPointerMove );
			scope.domElement.removeEventListener( 'pointerup', onPointerUp );


			if ( scope._domElementKeyEvents !== null ) {

				scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );
				scope._domElementKeyEvents = null;

			}

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		const scope = this;

		const STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};

		let state = STATE.NONE;

		const EPS = 0.000001;

		// current position in spherical coordinates
		const spherical = new Spherical();
		const sphericalDelta = new Spherical();

		let scale = 1;
		const panOffset = new Vector3();
		let zoomChanged = false;

		const rotateStart = new Vector2();
		const rotateEnd = new Vector2();
		const rotateDelta = new Vector2();

		const panStart = new Vector2();
		const panEnd = new Vector2();
		const panDelta = new Vector2();

		const dollyStart = new Vector2();
		const dollyEnd = new Vector2();
		const dollyDelta = new Vector2();

		const pointers = [];
		const pointerPositions = {};

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		const panLeft = function () {

			const v = new Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		const panUp = function () {

			const v = new Vector3();

			return function panUp( distance, objectMatrix ) {

				if ( scope.screenSpacePanning === true ) {

					v.setFromMatrixColumn( objectMatrix, 1 );

				} else {

					v.setFromMatrixColumn( objectMatrix, 0 );
					v.crossVectors( scope.object.up, v );

				}

				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		const pan = function () {

			const offset = new Vector3();

			return function pan( deltaX, deltaY ) {

				const element = scope.domElement;

				if ( scope.object.isPerspectiveCamera ) {

					// perspective
					const position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					let targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we use only clientHeight here so aspect ratio does not distort speed
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object.isOrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyOut( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyIn( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			rotateEnd.set( event.clientX, event.clientY );

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseWheel( event ) {

			if ( event.deltaY < 0 ) {

				dollyIn( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyOut( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			let needsUpdate = false;

			switch ( event.code ) {

				case scope.keys.UP:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						rotateUp( 2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight );

					} else {

						pan( 0, scope.keyPanSpeed );

					}

					needsUpdate = true;
					break;

				case scope.keys.BOTTOM:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						rotateUp( -2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight );

					} else {

						pan( 0, - scope.keyPanSpeed );

					}

					needsUpdate = true;
					break;

				case scope.keys.LEFT:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						rotateLeft( 2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight );

					} else {

						pan( scope.keyPanSpeed, 0 );

					}

					needsUpdate = true;
					break;

				case scope.keys.RIGHT:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						rotateLeft( -2 * Math.PI * scope.rotateSpeed / scope.domElement.clientHeight );

					} else {

						pan( - scope.keyPanSpeed, 0 );

					}

					needsUpdate = true;
					break;

			}

			if ( needsUpdate ) {

				// prevent the browser from scrolling on cursor keys
				event.preventDefault();

				scope.update();

			}


		}

		function handleTouchStartRotate() {

			if ( pointers.length === 1 ) {

				rotateStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				rotateStart.set( x, y );

			}

		}

		function handleTouchStartPan() {

			if ( pointers.length === 1 ) {

				panStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				panStart.set( x, y );

			}

		}

		function handleTouchStartDolly() {

			const dx = pointers[ 0 ].pageX - pointers[ 1 ].pageX;
			const dy = pointers[ 0 ].pageY - pointers[ 1 ].pageY;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartDollyPan() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enablePan ) handleTouchStartPan();

		}

		function handleTouchStartDollyRotate() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enableRotate ) handleTouchStartRotate();

		}

		function handleTouchMoveRotate( event ) {

			if ( pointers.length == 1 ) {

				rotateEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				rotateEnd.set( x, y );

			}

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

		}

		function handleTouchMovePan( event ) {

			if ( pointers.length === 1 ) {

				panEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				panEnd.set( x, y );

			}

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		function handleTouchMoveDolly( event ) {

			const position = getSecondPointerPosition( event );

			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

			dollyOut( dollyDelta.y );

			dollyStart.copy( dollyEnd );

		}

		function handleTouchMoveDollyPan( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enablePan ) handleTouchMovePan( event );

		}

		function handleTouchMoveDollyRotate( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enableRotate ) handleTouchMoveRotate( event );

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onPointerDown( event ) {

			if ( scope.enabled === false ) return;

			if ( pointers.length === 0 ) {

				scope.domElement.setPointerCapture( event.pointerId );

				scope.domElement.addEventListener( 'pointermove', onPointerMove );
				scope.domElement.addEventListener( 'pointerup', onPointerUp );

			}

			//

			addPointer( event );

			if ( event.pointerType === 'touch' ) {

				onTouchStart( event );

			} else {

				onMouseDown( event );

			}

		}

		function onPointerMove( event ) {

			if ( scope.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchMove( event );

			} else {

				onMouseMove( event );

			}

		}

		function onPointerUp( event ) {

			removePointer( event );

			if ( pointers.length === 0 ) {

				scope.domElement.releasePointerCapture( event.pointerId );

				scope.domElement.removeEventListener( 'pointermove', onPointerMove );
				scope.domElement.removeEventListener( 'pointerup', onPointerUp );

			}

			scope.dispatchEvent( _endEvent );

			state = STATE.NONE;

		}

		function onMouseDown( event ) {

			let mouseAction;

			switch ( event.button ) {

				case 0:

					mouseAction = scope.mouseButtons.LEFT;
					break;

				case 1:

					mouseAction = scope.mouseButtons.MIDDLE;
					break;

				case 2:

					mouseAction = scope.mouseButtons.RIGHT;
					break;

				default:

					mouseAction = -1;

			}

			switch ( mouseAction ) {

				case MOUSE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseDownDolly( event );

					state = STATE.DOLLY;

					break;

				case MOUSE.ROTATE:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					} else {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					}

					break;

				case MOUSE.PAN:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					} else {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onMouseMove( event ) {

			switch ( state ) {

				case STATE.ROTATE:

					if ( scope.enableRotate === false ) return;

					handleMouseMoveRotate( event );

					break;

				case STATE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseMoveDolly( event );

					break;

				case STATE.PAN:

					if ( scope.enablePan === false ) return;

					handleMouseMovePan( event );

					break;

			}

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE ) return;

			event.preventDefault();

			scope.dispatchEvent( _startEvent );

			handleMouseWheel( event );

			scope.dispatchEvent( _endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			trackPointer( event );

			switch ( pointers.length ) {

				case 1:

					switch ( scope.touches.ONE ) {

						case TOUCH.ROTATE:

							if ( scope.enableRotate === false ) return;

							handleTouchStartRotate();

							state = STATE.TOUCH_ROTATE;

							break;

						case TOUCH.PAN:

							if ( scope.enablePan === false ) return;

							handleTouchStartPan();

							state = STATE.TOUCH_PAN;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				case 2:

					switch ( scope.touches.TWO ) {

						case TOUCH.DOLLY_PAN:

							if ( scope.enableZoom === false && scope.enablePan === false ) return;

							handleTouchStartDollyPan();

							state = STATE.TOUCH_DOLLY_PAN;

							break;

						case TOUCH.DOLLY_ROTATE:

							if ( scope.enableZoom === false && scope.enableRotate === false ) return;

							handleTouchStartDollyRotate();

							state = STATE.TOUCH_DOLLY_ROTATE;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onTouchMove( event ) {

			trackPointer( event );

			switch ( state ) {

				case STATE.TOUCH_ROTATE:

					if ( scope.enableRotate === false ) return;

					handleTouchMoveRotate( event );

					scope.update();

					break;

				case STATE.TOUCH_PAN:

					if ( scope.enablePan === false ) return;

					handleTouchMovePan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_PAN:

					if ( scope.enableZoom === false && scope.enablePan === false ) return;

					handleTouchMoveDollyPan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_ROTATE:

					if ( scope.enableZoom === false && scope.enableRotate === false ) return;

					handleTouchMoveDollyRotate( event );

					scope.update();

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onContextMenu( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

		}

		function addPointer( event ) {

			pointers.push( event );

		}

		function removePointer( event ) {

			delete pointerPositions[ event.pointerId ];

			for ( let i = 0; i < pointers.length; i ++ ) {

				if ( pointers[ i ].pointerId == event.pointerId ) {

					pointers.splice( i, 1 );
					return;

				}

			}

		}

		function trackPointer( event ) {

			let position = pointerPositions[ event.pointerId ];

			if ( position === undefined ) {

				position = new Vector2();
				pointerPositions[ event.pointerId ] = position;

			}

			position.set( event.pageX, event.pageY );

		}

		function getSecondPointerPosition( event ) {

			const pointer = ( event.pointerId === pointers[ 0 ].pointerId ) ? pointers[ 1 ] : pointers[ 0 ];

			return pointerPositions[ pointer.pointerId ];

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu );

		scope.domElement.addEventListener( 'pointerdown', onPointerDown );
		scope.domElement.addEventListener( 'pointercancel', onPointerUp );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		// force an update at start

		this.update();

	}

}

function setupOrbitController(store) {

  // if ( ! store.xr.IS_XR_AVAIL ) {
    // if ( false ) {
    // we remove the priour renderer.domElement for webxrs overlay requirement
    // const mm = document.getElementById("rootlike");
    const orbitControls = new OrbitControls( store.camera, store.domElement );
    // window.aa = orbitControls;
    // orbitControls.addEventListener( 'change', render ); // use if there is no animation loop
    orbitControls.minDistance = 0.2;
    orbitControls.maxDistance = 100;
    // orbitControls.target.set( 0, 0, - 0.2 );
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    // orbitControls.rotateSpeed = 5;
    // orbitControls.update();
    orbitControls.enableDamping = true;
    store.orbitControls = orbitControls;

  // }

}

function setupDebuggerHitPoint(store, scale = 0.01){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: 0xcc44ff } );
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(scale);
  store.scene.add(sphere);
  store.hitpointSphere = sphere;
  store.hitpointSphere.visible = false;
}

function setupGridHelper({store, type}){

    const size = 2;
    const divisions = 10;
    // colorCenterLine : Color, colorGrid : Color
    if(type==="y"){
      const grid = new GridHelper( size, divisions, undefined, 0xff0000 );
      store.scene.add( grid );
      store.grids.y = grid;
    }
    if(type==="x"){
      const grid = new GridHelper( size, divisions, undefined, 0x00ff00 );
      store.scene.add( grid );
      store.grids.x = grid;
      grid.rotation.x = Math.PI/2;
    }
    if(type==="z"){
      const grid = new GridHelper( size, divisions, undefined, 0x0000ff );
      store.scene.add( grid );
      store.grids.z = grid;
      grid.rotation.z = Math.PI/2;
    }
    // if(x){
    //   const gridY = new GridHelper( size, divisions );
    //   store.scene.add( gridY );
    //   store.grids.y = gridY;
    // }
    // store.gridHelper = gridHelper;/
    // store.gridHelper.visible = store.debugSettings.showGridPlane;


}

// keyboards events

// import { makeAHorsey } from '@tools/makeAHorsey.js';
// import { makeAShoe } from '@tools/makeAShoe.js';


function setupKeyboardEvents(){
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case " ":
          console.log("?space¿");
          APP.reticle.visible = true;
          for (var i = 0; i < APP.shoesCache.length; i++) {
            APP.shoesCache[i].visible = false;
          }
          // makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
          // makeAShoe(_o.gltfFlower, _o.reticle, _o.scene);
          // makeAShoe({sourceWobject:_o.gltfFlower, reticle:_o.reticle, parent:_o.scene, addNav: true});
          break;
        case "a":
          console.log("?a");
          break;
        default:
          return;
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true,
  );
}

function setupPlaneHelper(store) {

  const plane = new Plane( new Vector3( 0,1,0 ), 0 );
  const helper = new PlaneHelper( plane, 0.2, 0xffff00 );
  store.scene.add( helper );
  store.debugPlane = plane;
  store.debugPlaneHelper = helper;
  store.debugPlaneHelper.visible = store.debugSettings.showWorldPlane;

}

function setupShadowPlane(store) {
  //Create a plane that receives shadows (but does not cast them)
  var pg = new PlaneGeometry( 1, 1, 32, 32 );
  // const material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
  const material = new ShadowMaterial();
  material.opacity = 0.4;
  store.shadowPlane = new Mesh( pg, material );
  store.shadowPlane.receiveShadow = true;
  store.shadowPlane.rotation.x = -Math.PI/2;
  store.scene.add( store.shadowPlane );

  store.shadowPlane.visible = store.debugSettings.showShadowPlane;


}

function setupTouchEvents(store){

  // window.addEventListener("resize", onWindowResize);

   // https://discourse.threejs.org/t/rotating-3d-object-in-webxr/15926/9
   // https://discourse.threejs.org/t/webxr-touch-input/21096
   // android not working, so back we go for now
   // we remove the priour renderer.domElement for webxrs overlay requirement
   // const mm = document.getElementById("rootlike");


   // store.domElement.addEventListener("pointermove", handleWhileDown);

   store.domElement.addEventListener("pointerdown", handleTouchStart);
   store.domElement.addEventListener("pointerup", handleTouchStop);
   store.domElement.addEventListener("pointermove", handlePointerMove);


   //
   // window.addEventListener("pointerdown", handleTouchStart);
   // window.addEventListener("pointerup", handleTouchStop);
   // window.addEventListener("pointermove", handlePointerMove);


}

class PhysicsModel{

  session = null; // T : PhysicsSession
  builder = null; // T : function
  replay = function() {
    if (this?.session?.stop) {
      this.session.stop();
    }
    
    this.builder();

    if(this?.session?.start){
      this.session.start();
    }
  }

  frameId = 0;
  mass = 1;
  acceleration = new Vector3();
  angularAcceleration = new Vector3();
  velocity = new Vector3();
  angularVelocity = new Vector3();

  physicsSession = null;
  spring = null;

  // this would be an impulse force since its sent once
  applyForce(force, damping){
    applyForce(this, force, damping);
  }

  updateSpringForce(force, damping){
    applySpringForce(this, this.spring, force, damping);
  }

  createSpring(anchorPosition, restLength, constantK){
    this.spring = new Spring(anchorPosition, restLength, constantK);
  }

  clearAcceleration(){
    this.acceleration.set(0,0,0);
  }

  clearAngularAcceleration(){
    this.angularAcceleration.set(0,0,0);
  }

}

// import { decoSuper3D } from './decoSuper3D.js';
const decoSuper3D$2 = await Promise.resolve().then(function () { return decoSuper3D$1; });


class SuperObject3D extends Object3D{
  tacos = 2;
  // memID not sure if need this yet, use a traverse when needed
  isSuperObject3D = true;
  selectorMesh = null;
  rootObject = null;
  isRoot = false;

  static = false;

	// used for material effects like fade in
	meshes = new CheapPool();

	// used for swaping the themes maybe
	// holds each material by string name
	materials = {};

  physics; // T : PhysicsModel

  constructor(){
    super();
    this.isSuperObject3D = true;
    this.type = 'SuperObject3D';  // Optional: set a type property for better identification
    this.physics = new PhysicsModel(this);
  }

  fish(){
    console.log("fiiish");
  }

  // is same as animate?
  update(deltaTime){
    // console.log("update?¿");
  }

  onAppear(){

  }

  /*
  Can do something like this now
  cube.animateDeco(function() {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    // console.log(this);
  })
  cube.animate();

  other ways

  const aa = spinnerY.bind(item);
  const speed = randomBetween(-0.04, 0.04);

  item.animateDeco(function() {
    aa(speed)
  })

  item.animate = spinnerY.bind(item, speed);

  item.animateDeco(function() {
    spinnerY.call(this, speed);
  })

  here .call is the simpiest to write to use reuseable functions
  like
  function spinnerY(speed = randomBetween(-1,1)) {
    this.rotation.y += speed;
  }
  but is .call(this) expenssive??!?!?!?

  */
  cachedAnimate = null;
  animate(deltaTime){
    // debugger
    if (this.cachedAnimate) {
      this.cachedAnimate();
    }
  }
  // animateDeco(funx) {
  //   this.animate = funx.bind(this);
  // }
  animateDeco(funx) {
    // debugger
    this.cachedAnimate = funx.bind(this);
    // this.animate = funx.bind(this);
  }

  // THIS One needs testing
  // AI:
  // See : https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L965
  // to just rewrite and follow their pattern
  // for now dont use clone
  clone() {
    const cloned = new SuperObject3D();
    Object3D.prototype.clone.call(this, true).copy(cloned); // Clone base Object3D properties into the new object

    // Oh... we need to do this for all the props...?
    cloned.materials = { ...this.materials };

    cloned.children = this.children.map((child) => {
      const childClone = child.clone();
      return childClone instanceof Object3D ? decoSuper3D$2(childClone) : childClone;
    });

    return cloned;
  }


  onTap(ev){}

  checkMeshes(){
    if (this.meshes.length === 0) { this.mapMeshes(); }
  }

  checkMappedMaterials(){
    if (this.materials === null || Object.keys(this.materials).length === 0 ) {
        this.mapMaterials();
    }
  }

  mapMaterials(){
    this.materials = {};

		this.traverse( ( item ) => {
			if ( item.isMesh ) {
				// this with no mat in the gltf are supplied a blank name material
		     if (item.material.name === "") {
					 this.materials[item.name] = item.material;
		     }
				 else {
					 this.materials[item.material.name] = item.material;
				 }
				 // this is jammed in
				 item.material.parentPointer = item;
			}
		});
	}


	printMaterialNames(){
    this.checkMappedMaterials();
		for (const propname in this.materials) {
			console.log(propname);
		}
	}

  // this belongs as wsome external complex thing
  randomColor(){
    if (this.isMesh) {
      this.material.color.setHex(Math.random() * 0xffffff);
    }
    this.traverse( ( item ) => {
     if (item.isMesh) {
       // _o.shoesCache[0].children[0].children[0].material.color.setHex
       item.material.color.setHex(Math.random() * 0xffffff);
			 // item.material.roughness = Math.random();
			 // item.material.metalness = Math.random();
     }
    });
  }

  mapMeshes(){
    this.traverse( ( item ) => {
      if ( item.isMesh ) {
        this.meshes.push(item);
      }
    });
  }

  // prepareMatsForFade(){
  //   this.traverse( ( item ) => {
  //     if ( item.isMesh ) {
  //       item.material.transparent = true;
  //       // item.material.opacity = 1.0;
  //       item.material.opacity = 1.0;
  //     }
  //   });
  // }


  setOpacity(val){
    // this breaks the "over_cloth" mat and any
    // overlapping order meshes for transparent effects
    this.checkMeshes();
    for (let i = 0; i < this.meshes.length; i++) {
      const item = this.meshes[i];
      // console.log("item", item.name, item.material.transparent, item.material.opacity);
      item.material.transparent = true;
      item.material.opacity = val;
    }
    // this.traverse( ( item ) => {
    //   if ( item.isMesh ) {
    //     item.material.transparent = true;
    //     item.material.opacity = val;
    //   }
    // });
  }


	// _o.shoesCache[0].setColorAll(0x00ff00)
	setColorAll(colorHex){
    this.checkMeshes();
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].material.color.setHex(colorHex);
    }
	}

  // @matName does lookup
  // @materialProxy : MaterialProxy
  setMaterialByName(matName, materialProxy){
    this.checkMappedMaterials();
    if (!materialProxy) {
      console.warn("Must have a MaterialProxy");
      return;
    }
    try {
      const mat = this.materials[matName];
      if (mat) {
        materialProxy.applyToMaterial(mat);
      }
    } catch (e) {
        console.log("eee setMaterialByName", e);
    }
  }



  // @theme, see DataNavItem.js
  // >>>>>
  // is an object by material names and a coresponding MaterialProxy
  applyTheme(themeObject){
    this.checkMappedMaterials();
    for (let i = 0; i < themeObject.length; i++) {
      const proxy = themeObject[i]?.matProxy;
      const mat = this.materials[themeObject[i]?.name];
      // console.log("aaaa", mat, proxy);
      if (mat && proxy) {
        // console.log("bbbb");
        proxy.applyToMaterial(mat);
      }
    }

  }
}

// some ai
// export function DecorateWithSuperObject3D(obj) {
function decoSuper3D(obj) {
  if (!(obj instanceof Object3D) ) {
    console.warn('The object must be an instance of Object3D.');
    return obj;
  }

  const superObject = new SuperObject3D();

  // dont use
  // Object.assign(obj, superObject);
  // does not get classical props like .position etc

  // so use the more wordy workers
  for (const key of Object.keys(superObject)) {
    if (!Object.getOwnPropertyDescriptor(obj, key)) {
      obj[key] = superObject[key];
    }
  }

  // Copy prototype methods (e.g., fish)
  Object.getOwnPropertyNames(SuperObject3D.prototype).forEach((key) => {
    if (key !== 'constructor') {
      obj[key] = superObject[key].bind(obj);
    }
  });


  // Copy child objects and replace them with decorated versions
  superObject.children = obj.children.map(decoSuper3D);

  if (obj instanceof Mesh) {
    // will need .clone() on these otherwise they hold refs
    superObject.material = obj.material;  // Preserve material references
    superObject.geometry = obj.geometry;  // Preserve geometry
  }


  return superObject;


}

var decoSuper3D$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  decoSuper3D: decoSuper3D
});

class ModelLoaderObject3D extends SuperObject3D{
  isModelLoaded = true;
  isRoot = true;
  selectorMesh = null;
  modelUrl = '';
  animations = null;
  mixer = null;

  constructor(modelUrl){
    super();
    this.modelUrl = modelUrl;
  }
  // have to run init after new cause GLTF is async
  async init(store){
    const gltfLoader = new GLTFLoader();

    const gltf = await gltfLoader.loadAsync( this.modelUrl );
    this.wrap(gltf, store);

    this.animations = gltf.animations;
    // this.mixer = gltf.scene.mixer;
    this.mixer = new AnimationMixer( gltf.scene );

// debugger
    this.update = function(deltaTime) {
      // this.super.update(deltaTime);
      this.updateAnimations(deltaTime);
    };

  }
  // preloaders will need to skip init()
  // so need to process after load
  // store is curious
  wrap(gltf, store){
    let model = gltf.scene;
    decoSuper3D(model);
    this.add(model);
    // need to store the gltf animations and other meta data here
    // skip for now, since project does not need it

    this.selectorMesh = model.getObjectByName("selector_mesh") || null;
    // console.log("model.selectorMesh", model.selectorMesh);
    if(this.selectorMesh) {
      this.selectorMesh.rootObject = this;
      if(store){
        store.raycastingGraph.add(this.selectorMesh);
      }
      //// store.addObject3D(model.selectorMesh);
      // model.selectorMesh.visible = false;
    }

  }




  // playAnimations(){
  //   if(this.mixer && this.animations){
  //     this.animations.forEach((clip) => {
  //       this.mixer.clipAction(clip).play();  // Play each animation
  //     });
  //   }
  // }

  playAnimations(){

      if(this.mixer && this.animations){
        this.mixer.stopAllAction();
        this.animations.forEach((clip) => {
          try {
            const action = this.mixer.clipAction(clip);
            if (action && action.reset && action.play) {
              action.reset();
              action.play();
            } else {
              // console.warn(`Skipping clip: ${clip.name} (No action found)`);
            }
          } catch (e) {
            // console.warn(`Failed to play animation: ${clip.name}`, e);
          }
          // this.mixer.clipAction(clip).reset().play();  // Play each animation
          // this.mixer.clipAction(clip).play();  // Play each animation
        });
      }

  }

  updateAnimations(deltaTime){
    // debugger
    // console.log("updateAnimations");
    if (this.mixer) {
      // console.log("updateAnimations, ", this.mixer);
        // this.mixer.update(clock.getDelta());  // Update animations
        this.mixer.update(deltaTime);  // Update animations
    }
  }
}

const _forceV = new Vector3();
const _forceAngularV = new Vector3();
new Vector3();



/*

gg = new PhysicsSession({
  wobj:moof,
  vecForce: new Vector3(0,0,1),
  damping: 0.2,
  coefriction: 0.04,
  spring: maybe new Spring(moof.position, 100, 0.2, 0.4),
  func: function(){
    console.log("fiiiish");
  }
})
gg.start();



gg = new PhysicsSession({
  wobj:moof,
  damping: 0.2,
  coefriction: 0.04,
  // var _spring = new Spring(moof.position, 400, 0.094);
  spring: new Spring(moof.position, 100, 0.2, 0.4),
  funx: function(){
    console.log("fiiiish");
  }
})
gg.start();

*/

// for now angular force is just an impulse type

class PhysicsSession{
  selected = null; // T : Object3D patched with .physics
  type = "fish"; // spring, impulse
  force = null; // T : Force or Spring
  angularForce = null; // T : Force or Spring
  loopId = 0;
  forceWork = new Vector3();
  angularForceWork = new Vector3();

  stopRequested = false;

  otherdata = {};

  startFunx = null;
  midFunx = null;
  doneFunx = null;

  // constructor( { wobj, vecForce, damping, coefriction, spring, func } ){
  constructor( { wobj, force, angularForce, type } ){
    this.selected = wobj;
    this.force = force;
    this.angularForce = angularForce;
    this.type = type;
  }
  decoStartFunx(funx){
    this.startFunx = funx.bind(this);
  }
  decoMidFunx(funx){
    this.midFunx = funx.bind(this);
  }
  decoDoneFunx(funx){
    this.doneFunx = funx.bind(this);
  }
  setForceAnchor(pos){
    this.force.anchor.copy(pos);
  }
  start(){
    // debugger
    this.stopRequested = false;

    if (this.type === "impulse") {
      // here we mutate the velocity of the object and prep it for the loop
      applyForce$1(this.selected, this.force.vecForce, this.force.damping);
      this.selected.physics.clearAcceleration();
    }
    else if (this.type === "spring") ;
    console.log(this.selected.position);

    // angular force
    applyAngularForce(this.selected, this.angularForce.vecForce, this.angularForce.damping);
    this.selected.physics.clearAngularAcceleration();

    // debugger
    // const _t = this;
    // setTimeout(function () {
    //   // debugger
    //   _t.stop();
    //   console.log("stop physics session");
    // }, 500)

    if(this.startFunx) this.startFunx();

    // looping function start

    const _this = this;

    this.loopR = function() {

      if (_this.stopRequested === true) {
        _this.stop();
        return;
      }

      // this makes it fricken jitter infinitely
      // getFriction(_this.forceWork, _this.selected.velocity, _this.force.coefriction);

      if(_this.type === "spring"){
        applySpringForce$1(_this.selected, _this.force, _this.forceWork, _this.force.damping);
      }
      else if (_this.type === "impulse") {
        // console.log("¿");
        applyForce$1(_this.selected, _this.forceWork, _this.force.damping);
      }

      // todo: this does not belong here
      // _this.selected.rotateY( _this.selected.velocity.length()* Math.PI * 9);
      applyAngularForce(_this.selected, _this.angularForceWork, _this.angularForce.damping);


      // custom extra
      if(_this.midFunx){
        _this.midFunx.call(_this);
      }


      _this.selected.physics.clearAcceleration();
      _this.selected.physics.clearAngularAcceleration();

      // if ( Math.abs( _this.selected.velocity.length() ) >= 0.00001) {
      if ( Math.abs( _this.selected.physics.velocity.length() && _this.selected.physics.angularVelocity.length() ) >= 0.0001) {
      // if (true) {
        // console.log(" reloop ");
        _this.loopId = requestAnimationFrame(_this.loopR);
      }
      else {
        if(_this.doneFunx) _this.doneFunx.call(_this);
        console.log("done??¿¿?¿");
      }


      // console.log(_this.selected.position);

    };

    // const _this = this;
    _this.loopR();


  } // start()


  stop(){
    this.stopRequested = true;
    cancelAnimationFrame(this.loopId);

  }

}



class Force{
  vecForce = new Vector3();
  damping = 1;
  coefriction = 1; // coefficient of friction is multiplyScalar'd so its default is 1
  constructor({vecForce, damping, coefriction}){
    this.vecForce.copy(vecForce);
    this.damping = damping;
    this.coefriction = coefriction;
  }

}


// the 3d model can store a spring, but otherwise you would place
// a spring into a cache maybe, but its a side object otherwise
// var _spring = new Spring(moof.position, 400, 0.094);

let Spring$1 = class Spring{
  anchor = new Vector3();
  restLength = 0;
  k = 0;
  damping = 1;
  //coefriction = 1;
  constructor({anchor, restLength, constantK, damping}){
    this.anchor.copy(anchor);
    this.restLength = restLength;
    this.k = constantK;
    this.damping = damping;
  }
};



// @force : Vector3

function applyAngularForce(wobj, force, damping = 1){
  _forceAngularV.copy(force);
  _forceAngularV.divideScalar(wobj.physics.mass);
  wobj.physics.angularAcceleration.add(_forceAngularV);
  wobj.physics.angularVelocity.add(wobj.physics.angularAcceleration);
  wobj.physics.angularVelocity.multiplyScalar(damping);

  // this is guessing since .rotation is an T: Euler and does not follow vector .add
  // since they have order options, default being XYZ
  wobj.rotation.x += wobj.physics.angularVelocity.x;
  wobj.rotation.y += wobj.physics.angularVelocity.y;
  wobj.rotation.z += wobj.physics.angularVelocity.z;
}

function applyForce$1(wobj, force, damping = 1){
  _forceV.copy(force);
  _forceV.divideScalar(wobj.physics.mass);
  wobj.physics.acceleration.add(_forceV);
  wobj.physics.velocity.add(wobj.physics.acceleration);
  wobj.physics.velocity.multiplyScalar(damping);
  wobj.position.add(wobj.physics.velocity);
}

// this computes the spring force which then is tossed to applyForce
function applySpringForce$1(wobj, spring, force, damping = 1){

  _forceV.copy(wobj.position);

  _forceV.sub(spring.anchor);

  var mag = _forceV.length();

  var delta = mag - spring.restLength;

  _forceV.normalize();

  var gg = -1 * spring.k * delta;

  _forceV.multiplyScalar( gg );

  applyForce$1(wobj, _forceV, damping);

}



// export flickForce(wobj, force, damping){
//   var _stop = stop;
// // moof.position.x = (_stop - moof.position.x) * speeeed * speeeed + moof.position.x;
// moof.position.x = easeInQuad(moof.position.x, 100, speeeed);
// // moof.position.x = easeOutBounce(moof.position.x, 100, speeeed);
// draw();
//
//   applyForce(moof, new Vector2(-20,0));
//
//
//
//   if ( Math.abs( moof.velocity.length() ) >= 0.001) {
//   // if (true) {
//     mm = requestAnimationFrame(loopR);
//     moof.clearAcceleration();
//
//   }
//   else {
//     console.log("done??¿¿?¿");
//   }
//
// }

// const fs = require('fs');

// export function checkIfFileExists(filePath, two="") {
//   // const filePath = "./public/models/mesh.glb";
//
//
//   if (fs.existsSync(filePath)) {
//     console.log("File exists", two);
//   } else {
//     console.log("File does not exist");
//   }
// }


async function checkIfFileExists(filePath, two="") {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    if (response.ok) {
      console.log("File exists:", filePath, two);
    } else {
      console.log("File does not exist:", filePath);
    }
  } catch (error) {
    console.error("Error checking file:", error);
  }
}

// Example usage
// checkIfFileExists("/public/models/mesh.glb");

class Preloader{
  static instance = null;



}

// src/main.js
// import foof from './foof.js';
const Primitives = {
  ball : ball,
  line : line
};
const Lights = {
  hemisphereLight : hemisphereLight
};

export { APP, CheapPool, DeltaFrame, Force, Lights, MaterialProxy, ModelLoaderObject3D, PhysicsModel, PhysicsSession, Preloader, Primitives, REVISION, RollyController, Spring$1 as Spring, SuperObject3D, spinners as a_spinners, addResizeWindow, animateDeco, applyAngularForce, applyForce$1 as applyForce, applySpringForce$1 as applySpringForce, checkIfFileExists, decoSuper3D, foof, handlePointerMove, handleTouchStart, handleTouchStop, init3d, narf, setupDebuggerHitPoint, setupGameLoopWithFPSClamp, setupGridHelper, setupKeyboardEvents, setupOrbitController, setupPlaneHelper, setupShadowPlane, setupTouchEvents, setupXR, setupXRLighting, setupXRRenderLoopHook, testOrbitControlsToggle, touchEventsData, utilites };
