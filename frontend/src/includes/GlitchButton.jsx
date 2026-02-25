import React from 'react';

const GlitchButton = ({ text = "call", onClick }) => {
  const styles = `
    .ui-btn {
      --btn-letter-spacing: .1rem;
      --btn-animation-duration: 1.5s;
      --btn-color: white;
      --font-size: 16px;
      --font-weight: 600;
      --font-family: Menlo, Roboto Mono, monospace;

      box-sizing: border-box;
      padding: 15px 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--btn-color);
      font: var(--font-weight) var(--font-size) var(--font-family);
      
      background: transparent; 
      border: none;
      cursor: pointer;
      overflow: hidden;
    }

    .ui-btn span {
      letter-spacing: var(--btn-letter-spacing);
      box-sizing: border-box;
      position: relative;
    }

    .ui-btn span::before {
      box-sizing: border-box;
      position: absolute;
      content: "";
      /* Changed 'infinite' to 'forwards'. 
        It will now run exactly once when the button renders.
      */
      animation: chitchat linear forwards var(--btn-animation-duration);
    }

    @keyframes chitchat {
      0% { content: "#"; }
      5% { content: "."; }
      10% { content: "^{"; }
      15% { content: "-!"; }
      20% { content: "#$_"; }
      25% { content: "№:0"; }
      30% { content: "#{+."; }
      35% { content: "@}-?"; }
      40% { content: "?{4@%"; }
      45% { content: "=.,^!"; }
      50% { content: "?2@%"; }
      55% { content: "\\\\;1}]"; }
      60% { content: "?{%:%"; right: 0; }
      65% { content: "|{f[4"; right: 0; }
      70% { content: "{4%0%"; right: 0; }
      75% { content: "'1_0<"; right: 0; }
      80% { content: "{0%"; right: 0; }
      85% { content: "]>'"; right: 0; }
      90% { content: "4"; right: 0; }
      95% { content: "2"; right: 0; }
      100% { content: ""; right: 0; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <button className="ui-btn" onClick={onClick}>
        <span>{text}</span>
      </button>
    </>
  );
};

export default GlitchButton;