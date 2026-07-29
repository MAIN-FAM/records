// No Man's Sky Portal Glyphs
// Uses NMS-Glyphs-Mono.ttf via @font-face

const GLYPH_MAP = {
  sunset: 0, bird: 1, face: 2, diplo: 3, eclipse: 4,
  balloon: 5, boat: 6, bug: 7, dragonfly: 8, galaxy: 9,
  voxel: 10, fish: 11, tent: 12, rocket: 13, tree: 14, atlas: 15,
};

const HEX = "0123456789ABCDEF";

function nmsGlyphPlugin(md) {
  const RE = /:glyph-([a-z0-9_+-]+):/g;

  md.core.ruler.after("inline", "nms-glyph", function (state) {
    const blocks = state.tokens;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type !== "inline") continue;
      const inline = blocks[i];
      if (!inline.children) continue;
      const tokens = inline.children;
      for (let j = 0; j < tokens.length; j++) {
        if (tokens[j].type !== "text") continue;
        const text = tokens[j].content;
        if (!RE.test(text)) continue;
        RE.lastIndex = 0;
        const parts = text.split(/:glyph-([a-z0-9_+-]+):/);
        const newTokens = [];
        for (let k = 0; k < parts.length; k++) {
          if (k % 2 === 0) {
            if (parts[k]) {
              const t = new state.Token("text", "", 0);
              t.content = parts[k];
              newTokens.push(t);
            }
          } else {
            const raw = parts[k];
            let idx = GLYPH_MAP[raw];
            if (idx === undefined) {
              idx = parseInt(raw, 10);
              if (isNaN(idx) || idx < 0 || idx > 15) idx = -1;
            }
            if (idx >= 0) {
              const t = new state.Token("html_inline", "", 0);
              t.content = `<span class="nms-glyph" aria-label="glyph-${raw}">${HEX[idx]}</span>`;
              newTokens.push(t);
            } else {
              const t = new state.Token("text", "", 0);
              t.content = ":" + raw + ":";
              newTokens.push(t);
            }
          }
        }
        tokens.splice.apply(tokens, [j, 1].concat(newTokens));
        j += newTokens.length - 1;
      }
    }
  });
}

export { nmsGlyphPlugin, GLYPH_MAP };
