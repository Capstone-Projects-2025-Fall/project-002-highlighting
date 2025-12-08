let server: any;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  server = await import('../server.mjs');
});

describe('findRelevantWords', () => {
  it('prioritizes context words and filters stop words', () => {
    const words = ['help', 'door', 'and', 'yes', 'banana', 'goodbye'];
    const result = server.findRelevantWords('please help me open the door', words);

    expect(result[0]).toBe('help');
    expect(result).toContain('door');
    expect(result).toContain('yes');
    expect(result).not.toContain('and');
    expect(result).not.toContain('banana');
  });
});

describe('calculateRMSEnergy', () => {
  it('returns 0 for empty audio and computes RMS for samples', () => {
    expect(server.calculateRMSEnergy(new Float32Array())).toBe(0);
    expect(server.calculateRMSEnergy(new Float32Array([0.5, -0.5]))).toBeCloseTo(0.5);
  });
});

describe('createWavFile + wavToFloat32Array', () => {
  it('converts PCM samples into a WAV buffer and back to normalized floats', () => {
    const pcm = Buffer.alloc(4);
    pcm.writeInt16LE(32767, 0);
    pcm.writeInt16LE(-32768, 2);

    const wav = server.createWavFile(pcm);
    const samples = server.wavToFloat32Array(wav);

    expect(samples).toHaveLength(2);
    expect(samples[0]).toBeCloseTo(32767 / 32768, 5);
    expect(samples[1]).toBeCloseTo(-1, 5);
  });
});

describe('validateTranscription', () => {
  it('rejects empty or low-energy transcripts and allows valid speech', () => {
    expect(server.validateTranscription('', 0.5)).toBe(false);
    expect(server.validateTranscription('hello', 0.0001)).toBe(false);
    expect(server.validateTranscription('Thanks for watching my channel', 0.5)).toBe(false);
    expect(server.validateTranscription('this is a clear sentence', 0.5)).toBe(true);
  });
});

describe('cleanTranscription', () => {
  it('removes bracketed markers, carets, and extra punctuation', () => {
    const dirty = ' [INAUDIBLE] hello... ^^^ [gunshot] world ';
    expect(server.cleanTranscription(dirty)).toBe('hello world');
  });
});

describe('calculateSimilarity', () => {
  it('detects exact matches and overlap similarity', () => {
    expect(server.calculateSimilarity('Hello world', 'hello world')).toBe(1);
    expect(server.calculateSimilarity('hello there', 'hello world')).toBeCloseTo(1 / 3, 5);
    expect(server.calculateSimilarity('', 'hello')).toBe(0);
  });
});
