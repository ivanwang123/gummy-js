import {blocks} from "./blocks.js"
import {examples, setEditorScript} from "./examples.js"

const editor = $("#code-editor")
const alert = $("#alert")
const blocksContainer = $("#blocks-container")

console.log(blocks)

function resizeBlock(block) {
  block.css("width", "max-content")
  block.css("height", "max-content")
}

// Resize block and all of its parents
function resizeParents(block) {
  resizeBlock(block)

  block.parents().each((index) => {
    const parent = block.parents().eq(index)
    
    if (parent.hasClass("dropped") || parent.hasClass("block-div-input")) {
      resizeBlock(parent)
    }
  })
}

// Recursively add sortable function to blocks
function addInputAndSortable(block) {
  if (!block.hasClass("dropped")) {
    block.addClass("dropped")

    if (block.children(".block-div-input").length) {
      block.children().each((index) => {
        const child = block.children().eq(index)

        if (child.hasClass("block-div-input")) {
          child.removeClass("block-div-input-undropped")
          child.sortable({
            connectWith: ".ui-sortable",
            update: function(e, ui) {
              addInputAndSortable(ui.item)
              resizeParents(child)
            },
            over: function() {
              resizeParents(child)
              console.log('OVER')
            },
            out: function() {
              setTimeout(() => {
                resizeParents(child)
              }, 1)
            }
          })
        }
      })
    }

    if (block.children(".block-input").length) {
      block.children().each((index) => {
        const child = block.children().eq(index)
        const placeholderText = child.text()

        if (child.hasClass("block-input")) {
          child.html("")
          child.removeClass("block-input")
          child.addClass("block-input-wrapper")

          const blockInput = $("<input></input>")
          blockInput.type = "text"
          blockInput.addClass("block-input")
          blockInput.attr("placeholder", placeholderText)
          blockInput.attr("value", child.val())
          blockInput.attr("size", 6)
          blockInput.on("input", function() {
            this.parentNode.dataset.value = this.value.replace(/'/g, '\\"')
          })

          child.append(blockInput)
        }
      })
    }

    if (block.children(".multiblock-input").length) {
      block.children().each((index) => {
        const child = block.children().eq(index)
        const placeholderText = child.text()

        if (child.hasClass("multiblock-input")) {
          child.html("")

          const blockInput = $("<textarea></textarea>")
          blockInput.addClass("multiblock-input")
          blockInput.attr("placeholder", placeholderText)
          blockInput.attr("value", child.val())
          blockInput.on("input", function() {
            this.parentNode.dataset.value = this.value.replace(/'/g, '\\"')
          })

          child.replaceWith(blockInput)
        }
      })
    }

    resizeBlock(block)
  }
}

editor.sortable({
  connectWith: ".ui-sortable",
  update: function(e, ui) {
    addInputAndSortable(ui.item)
  }
})

blocksContainer.droppable({
  accept: function(e) {
    return e.hasClass("dropped")
  },
  drop: function(e, ui) {
    ui.draggable.remove()
  }
})

// Generate all available blocks
for (const [categoryKey, categoryValue] of Object.entries(blocks)) {
  const categoryHeader = $("<span></span>")
  categoryHeader.addClass("block-category-header")
  categoryHeader.addClass(`${categoryKey}-header`)
  categoryHeader.text(categoryKey)
  blocksContainer.append(categoryHeader)

  for (const [key, value] of Object.entries(categoryValue)) {
    const {code, parameters} = value

    const newBlock = $("<div></div>")
    newBlock.addClass("draggable-block")
    newBlock.addClass(`${categoryKey}-block`)
    newBlock.data("code", code)
    newBlock.draggable({
      helper: "clone",
      connectToSortable: ".ui-sortable"
    })

    if (!parameters.length) {
      newBlock.text(code)
      blocksContainer.append(newBlock)
    } else {
      const codePieces = code.split("%")
      codePieces.forEach((piece) => {
        if (piece.length) {
          if (piece !== " " && !isNaN(piece)) {
            if (parameters[parseInt(piece)] === "block") {
              const blockInput = $("<div></div>")
              blockInput.addClass("block-div-input")
              blockInput.addClass("block-div-input-undropped")
              newBlock.addClass("block-div-input-wrapper")
              newBlock.append(blockInput)
            } else if (parameters[parseInt(piece)] === "multiblock") {
              const blockInput = $("<div></div>")
              blockInput.addClass("multiblock-input")
              blockInput.text("freestyle")
              newBlock.append(blockInput)
            } else {
              const blockInput  = $("<span></span>")
              blockInput.addClass("block-input")
              blockInput.text(parameters[parseInt(piece)])
              newBlock.append(blockInput)
            }
          } else {
            const blockText = $("<span></span>")
            blockText.text(piece)
  
            newBlock.append(blockText)
          }
        }
      })
  
      blocksContainer.append(newBlock)
    }
  }
}

// Check for syntax errors and display (ex. missing args)
window.onerror = function(e) {
  alert.append($("<div></div>").text(e))
}

// Resize canvas with 4:3 ratio
const resizeCanvas = () => {
  $("#canvas").css("width", $(".canvas-wrapper").width())
  $("#canvas").css("height", $(".canvas-wrapper").width() * 0.75)
}
resizeCanvas()

$(window).resize(() => {
  resizeCanvas()
})

let prevBlockWidth = $(".blocks-section").width()
$(".blocks-section").resizable({
  handles: "e",
  resize: (e, ui) => {
    const dir = ui.size.width - prevBlockWidth
    prevBlockWidth = ui.size.width

    if ($(".editor-section").width() <= 100 && dir > 0) {
      $(".canvas-section").css("flex", "1 1 auto")
      $(".canvas-section").css("width", $(".canvas-section").width())

      if ($(".canvas-section").width() <= 100) {
        $(".blocks-section").resizable("option", "maxWidth", $(".blocks-section").width())
      }
    } else {
      $(".canvas-section").css("flex", "0 0 auto")
    }

    $(".blocks-section").css("flex", "0 0 auto")
    $(".editor-section").css("flex", "1 1 auto")
    $(".editor-section").css("width", $(".editor-section").width())
  }
})

let prevCanvasWidth = $(".canvas-section").width()
$(".canvas-section").resizable({
  handles: "w",
  resize: (e, ui) => {
    const dir = ui.size.width - prevCanvasWidth
    prevCanvasWidth = ui.size.width

    if (($(".editor-section").width() <= 100) && dir > 0) {
      $(".blocks-section").css("flex", "1 1 auto")
      $(".blocks-section").css("width", $(".blocks-section").width())

      if ($(".blocks-section").width() <= 100) {
        $(".canvas-section").resizable("option", "maxWidth", $(".canvas-section").width())
      }
    } else {
      $(".blocks-section").css("flex", "0 0 auto")
    }

    $(".editor-section").css("flex", "1 1 auto")
    $(".editor-section").css("width", $(".editor-section").width())

    $(".canvas-section").css("flex", "0 0 auto")
    $(".canvas-section").css("left", "0")
  }
})

$(".editor-section").css("width", $(".editor-section").width())


// Recursively parse blocks to string
function parseCode(block, script) {
  if (block.children().length) {
    let blockScript = ""
    block.children().each((index) => {
      blockScript += parseCode(block.children().eq(index), script)
    })
    return blockScript
  } else {
    const text = block.val() || block.text()
    const lastChar = text.charAt(text.length-1)
    let newLine = ""
    if (lastChar === ";" || lastChar === "{")
      newLine = "\n"
    else if (lastChar === "}")
      newLine = "\n\n"

    console.log(block.val(), block.html(), block.text())
    return script += text + newLine
  }
}

// Recursively remove dropped class and set input values
function parseBlocks(block, script) {
  block.removeClass("dropped")
  if (block.children().length) {
    block.children().each((index) => {
      parseBlocks(block.children().eq(index), script)
    })
    return null
  } else {
    if (block.hasClass('block-input')) {
      const parsedString = block.val().replace(/'/g, '\\"')
      block.attr("value", parsedString)
    }
    return null
  }
}

const runCode = () => {

  // parseBlocks(editor, "")
  // console.log(editor.html())

  // Clone canvas to remove all event listeners
  let old_element = $("#canvas")
  let new_element = old_element.clone()
  old_element.replaceWith(new_element)

  // Clear all intervals/timeouts
  for(let i = 0; i < 10000; i++) {
    window.clearInterval(i)
    window.clearTimeout(i)
  }

  let canvas = $("#canvas")

  // Remove script elements
  canvas.children().remove()
  alert.children().remove()

  // Create script with code in editor
  let script = $("<script></script>")

  script.append(parseCode(editor, ""))

  alert.append($("<header></header>").addClass("alert-header").text("Console"))

  // Add script to canvas
  canvas.append(script)
  canvas.focus()
}

// Run code on run/refresh
$("#run-btn").click(runCode)
$("#refresh-btn").click(runCode)

// Switch between block mode and script mode
$("#script-mode").click(() => {
  $("#script-preview").text(parseCode(editor, ""))
  $("#code-editor").css("display", "none")
  $(".editor-options").css("display", "none")
  $("#script-preview").css("display", "block")
  $("#script-mode").css("opacity", 1)
  $("#block-mode").css("opacity", 0.6)
})

$("#block-mode").click(() => {
  $("#code-editor").css("display", "block")
  $(".editor-options").css("display", "flex")
  $("#script-preview").css("display", "none")
  $("#block-mode").css("opacity", 1)
  $("#script-mode").css("opacity", 0.6)
})
$("#block-mode").click()

// Clear editor
$("#clear-btn").click(() => {
  editor.html('')
  runCode()
})

// Reset example
$("#reset-btn").click(() => {
  setExample($("#editor-selector").val())
})

// Select examples
$("#editor-selector").on("change", (e) => {
  if (e.target.value === "editor")
    $("#reset-btn").css("display", "none")
  else
    $("#reset-btn").css("display", "block")

  console.log($("#editor-selector").data("prev"))
  if ($("#editor-selector").data("prev") === "editor") {
    parseBlocks(editor, "")
    setEditorScript(editor.html())
  }

  $("#editor-selector").data("prev", e.target.value)
  setExample(e.target.value)
})

const setExample = (example) => {
  const script = examples[example]

  if (script) {
    editor.html(script)
    editor.children().each((index) => {
      addInputAndSortable(editor.children().eq(index))
    })
  } else {
    editor.html('')
  }
}

// Intercept log messages and display in alert
// console.log = function (message) {
//   alert.append($("<div></div>").text(message))
// }

// Download html file of the code
$("#download-btn").click(() => {
  const beforeText = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Scratch</title>
    </head>
    <body>
      <canvas id="canvas" width="400" height="300" tabindex="1" autofocus></canvas>
      <script>
    `
  const afterText = `
      </script>
    </body>
    </html>
    `
  const scriptText = parseCode(editor, "")

  const blob = new Blob([beforeText+scriptText+afterText], {type: "text/plain"})

  const fileName = "scratch.html"

  const downloadLink = $("<a></a>")

  downloadLink.attr("download", fileName)
  window.URL = window.URL || window.webkitURL
  downloadLink.attr("href", window.URL.createObjectURL(blob))
  downloadLink.css("display", "none")
  $(document.body).append(downloadLink)
  downloadLink[0].click()           

  downloadLink.remove()
})

// editor.html('<div class="draggable-block canvas-block ui-draggable ui-draggable-handle" style="width: max-content; height: max-content;">var canvas = document.getElementById("canvas");</div><div class="draggable-block canvas-block ui-draggable ui-draggable-handle" style="width: max-content; height: max-content;">var ctx = canvas.getContext("2d");</div><div class="draggable-block control-block ui-draggable ui-draggable-handle block-div-input-wrapper" style="width: max-content; height: max-content;"><span>if (</span><input class="block-input" placeholder="" value="true"><span>) {</span><div class="block-div-input ui-sortable" style="width: max-content; height: max-content;"><div class="draggable-block misc-block ui-draggable ui-draggable-handle ui-sortable-handle" style="width: max-content; height: max-content;"><span>console.log(</span><input class="block-input" placeholder="message" value="&quot;TRUE&quot;"><span>);</span></div><div class="draggable-block canvas-block ui-draggable ui-draggable-handle" style="width: max-content; height: max-content;"><span>ctx.fillRect(</span><input class="block-input" placeholder="x" value="0"><span>, </span><input class="block-input" placeholder="y" value="0"><span>, </span><input class="block-input" placeholder="width" value="100"><span>, </span><input class="block-input" placeholder="height" value="100"><span>);</span></div><div class="draggable-block control-block ui-draggable ui-draggable-handle block-div-input-wrapper" style="width: max-content; height: max-content;"><span>if (</span><input class="block-input" placeholder="condition" value="1 < 2"><span>) {</span><div class="block-div-input ui-sortable" style="width: max-content; height: max-content;"><div class="draggable-block variable-block ui-draggable ui-draggable-handle" style="z-index: 1000; width: max-content; height: max-content;"><span>var </span><input class="block-input" placeholder="name" value="test"><span> = </span><input class="block-input" placeholder="value" value="12"><span>;</span></div><div class="draggable-block misc-block ui-draggable ui-draggable-handle" style="width: max-content; height: max-content;"><span>console.log(</span><input class="block-input" placeholder="message" value="&quot;TEST: &quot; +test"><span>);</span></div></div><span>}</span></div></div><span>}</span></div>')
// editor.children().each((index) => {
//   addInputAndSortable(editor.children().eq(index))
// })


// === TEST CODE ===
  /*
    try {
    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    ctx.fillStyle = "#FF0000"
    ctx.fillRect(0, 0, 150, 75)
    var x = 0
    canvas.addEventListener("keydown", function() {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        x++
        ctx.fillRect(x, 0, 150, 75)
      } catch (e) {
        alert.text(e)
      }
    })
  } catch (e) {
    alert.text(e)
  }
  */
  // =================



// === CODE GRAVEYARD ===

  // console.log("MOUSE UP", {x: e.pageX, y: e.pageY})
  // const blockRight = block.offset().left + block.width()
  // const blockLeft = block.offset().left
  // const blockBottom = block.offset().top + block.height()
  // const blockTop = block.offset().top

  // const editorRight = editor.offset().left + editor.width()
  // const editorLeft = editor.offset().left
  // const editorBottom = editor.offset().top + editor.height()
  // const editorTop = editor.offset().top

  // if (blockRight > editorLeft && 
  //     blockLeft < editorRight && 
  //     blockBottom > editorTop && 
  //     blockTop < editorBottom) {

  //     console.log("ADD CODE", code)
  //     block.unbind()
  //     block.remove()
  //     editor.append("\n"+code)
  // }



      // newBlock.on("mousedown", (e) => blocksContainer.append(newBlock.clone()))
    // newBlock.on("mouseup", (e) => addBlock(e, newBlock, code))



    // Resize a block to fit its children
// function resizeBlock(block) {
//   let newHeight = 0
//   let top = $(window).height()
//   let bottom = 0

//   block.children().each((index) => {
//     const rect = block.children().eq(index)[0].getBoundingClientRect()
//     if (rect.top < top)
//       top = rect.top
//       if (rect.bottom > bottom)
//       bottom = rect.bottom
//   })
  
//   newHeight = bottom - top
//   block.css("height", newHeight)
// }