export const blocks = {
  "canvas": {
    "get-canvas": {
      "code": `var canvas = document.getElementById("canvas");`,
      "parameters": []
    },
    "get-context": {
      "code": `var ctx = canvas.getContext("2d");`,
      "parameters": []
    }
  },
  "path": {
    "begin-path": {
      "code": "ctx.beginPath();",
      "parameters": []
    },
    "close-path": {
      "code": "ctx.closePath();",
      "parameters": []
    },
    "move-to": {
      "code": "ctx.moveTo(%0%, %1%);",
      "parameters": ["x", "y"]
    },
    "line-to": {
      "code": "ctx.lineTo(%0%, %1%);",
      "parameters": ["x", "y"]
    },
    "rect": {
      "code": "ctx.rect(%0%, %1%, %2%, %3%);",
      "parameters": ["x", "y", "width", "height"]
    },
    "quadratic-curve-to": {
      "code": "ctx.quadraticCurveTo(%0%, %1%, %2%, %3%);",
      "parameters": ["cpx", "cpy", "x", "y"]
    },
    "bezier-curve-to": {
      "code": "ctx.bezierCurveTo(%0%, %1%, %2%, %3%, %4%, %5%);",
      "parameters": ["cpx1", "cpy1", "cpx2", "cpy2", "x", "y"]
    },
    "arc": {
      "code": "ctx.arc(%0%, %1%, %2%, %3%, %4%, %5%);",
      "parameters": ["x", "y", "radius", "sAngle", "eAngle", "counterclockwise"]
    },
    "arc-to": {
      "code": "ctx.arc(%0%, %1%, %2%, %3%, %4%);",
      "parameters": ["x1", "y1", "x2", "y2", "radius"]
    },
    "stroke": {
      "code": "ctx.stroke();",
      "parameters": []
    },
    "fill": {
      "code": "ctx.fill();",
      "parameters": []
    },
    "close-path": {
      "code": "ctx.closePath();",
      "parameters": []
    },
  },
  "draw": {
    "fill-style": {
      "code": "ctx.fillStyle = %0%;",
      "parameters": ["color"]
    },
    "stroke-style": {
      "code": "ctx.strokeStyle = %0%;",
      "parameters": ["color"]
    },
    "clear-rect": {
      "code": "ctx.clearRect(%0%, %1%, %2%, %3%);",
      "parameters": ["x", "y", "width", "height"]
    },
    "fill-rect": {
      "code": "ctx.fillRect(%0%, %1%, %2%, %3%);",
      "parameters": ["x", "y", "width", "height"]
    },
    "stroke-rect": {
      "code": "ctx.strokeRect(%0%, %1%, %2%, %3%);",
      "parameters": ["x", "y", "width", "height"]
    },
  },
  "line": {
    "line-width": {
      "code": "ctx.lineWidth = %0%;",
      "parameters": ["width"]
    },
    "line-cap": {
      "code": "ctx.lineCap = \"%0%\";",
      "parameters": ["cap"]
    },
    "line-join": {
      "code": "ctx.lineJoin = \"%0%\";",
      "parameters": ["join"]
    },
  },
  "transformation": {
    "translate": {
      "code": "ctx.translate(%0%, %1%);",
      "parameters": ["x", "y"]
    },
    "rotate": {
      "code": "ctx.rotate(%0%);",
      "parameters": ["angle"]
    },
    "scale": {
      "code": "ctx.scale(%0%, %1%);",
      "parameters": ["x", "y"]
    }
  },
  "text": {
    "font": {
      "code": "ctx.font = \"%0% %1%\";",
      "parameters": ["size", "family"]
    },
    "text-align": {
      "code": "ctx.textAlign = \"%0%\";",
      "parameters": ["align"]
    },
    "text-baseline": {
      "code": "ctx.textBaseline = \"%0%\";",
      "parameters": ["baseline"]
    },
    "fill-text": {
      "code": "ctx.fillText(%0%, %1%, %2%, %3%);",
      "parameters": ["text", "x", "y", "maxWidth"]
    },
    "stroke-text": {
      "code": "ctx.strokeText(%0%, %1%, %2%, %3%);",
      "parameters": ["text", "x", "y", "maxWidth"]
    }
  },
  "shadow": {
    "shadow-offset-x": {
      "code": "ctx.shadowOffsetX = %0%;",
      "parameters": ["x"]
    },
    "shadow-offset-y": {
      "code": "ctx.shadowOffsetY = %0%;",
      "parameters": ["y"]
    },
    "shadow-offset-blur": {
      "code": "ctx.shadowBlur = %0%;",
      "parameters": ["blur"]
    },
    "shadow-color": {
      "code": "ctx.shadowColor = %0%;",
      "parameters": ["color"]
    }
  },
  "gradient": {
    "linear-gradient": {
      "code": "var %0% = ctx.createLinearGradient(%1%, %2%, %3%, %4%);",
      "parameters": ["name", "x1", "y1", "x2", "y2"]
    },
    "radial-gradient": {
      "code": "var %0% = ctx.createRadialGradient(%1%, %2%, %3%, %4%, %5%, %6%);",
      "parameters": ["name", "x1", "y1", "r1", "x2", "y2", "r2"]
    },
    "color-stop": {
      "code": "%0%.addColorStop(%1%, %2%);",
      "parameters": ["gradient", "offset", "color"]
    }
  },
  "variable": {
    "variable": {
      "code": "var %0% = %1%;",
      "parameters": ["name", "value"]
    },
    "reassign": {
      "code": "%0% = %1%;",
      "parameters": ["name", "value"]
    }
  },
  "control": {
    "if": {
      "code": "if (%0%) {%1%}",
      "parameters": ["condition", "block"]
    },
    "if-else": {
      "code": "if (%0%) {%1%} else {%2%}",
      "parameters": ["condition", "block", "block"]
    },
    "for": {
      "code": "for (%0%; %1%; %2%) {%3%}",
      "parameters": ["initialization", "condition", "iteration", "block"],
    },
    "while": {
      "code": "while (%0%) {%1%}",
      "parameters": ["condition", "block"],
    }
  },
  "event": {
    "event-listener": {
      "code": "canvas.addEventListener(\"%0%\", function(e) {%1%});",
      "parameters": ["event", "block"]
    }
  },
  "time": {
    "timeout": {
      "code": "setTimeout(function() {%0%}, %1%);",
      "parameters": ["block", "time"]
    },
    "interval": {
      "code": "setInterval(function() {%0%}, %1%);",
      "parameters": ["block", "time"]
    }
  },
  "debug": {
    "console-log": {
      "code": "console.log(%0%);",
      "parameters": ["message"]
    },
    "freestyle": {
      "code": "%0%",
      "parameters": ["multiblock"]
    }
  }
}