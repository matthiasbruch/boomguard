var explosionEmitterConfig = {
  alpha: {
    start: 1,
    end: 0.29,
  },
  scale: {
    start: 0.21,
    end: 0.01,
    minimumScaleMultiplier: 1,
  },
  lifetime: {
    min: 0.1,
    max: 0.5,
  },
  blendMode: "normal",
  frequency: 0.001,
  emitterLifetime: 0.2,
  maxParticles: 200,
  pos: {
    x: 100,
    y: 100,
  },
  behaviors: [
    {
      type: "spawnShape",
      config: {
        type: "torus",
        data: {
          x: 0,
          y: 0,
          radius: 20,
        },
      },
    },
    {
      type: "textureSingle",
      config: {
        texture: PIXI.Texture.from("images/particles/particle-small.png"),
      },
    },
    {
      type: 'color',
      config: {
        color: {
          start: "#c7471c",
          end: "#fff93d",
        }
      },
    },
  ],
};
