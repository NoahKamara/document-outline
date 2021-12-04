import "./style.css"
import craftXIconSrc from "./craftx-icon.png"

craft.env.setListener((env) => {
  switch (env.colorScheme) {
    case "dark":
      document.body.classList.add("dark");
      break;
    case "light":
      document.body.classList.remove("dark");
      break;
  }
})

class Outlineable {
  label: string
  style: number
  indent: number
  children: Outlineable[] = [];

  constructor(label: string, style: number, indent: number) {
    this.label = label
    this.style = style
    this.indent = indent
  }

  static new(label: string, style: number, indent: number) {
    return new Outlineable(label, style, indent)
  }

  log(indent: number = 0) {
    if (indent == 0) {
      console.log(`OUTLINE WITH ROOT ${this.label}`)
    }

    console.log(indent+" ".repeat(indent)+`${this.label} (${this.children.length})`)
    this.children.map(child => child.log(indent + 1))
  }

  makeHTML(indent: number = 0): string {
    let html = `<li>${this.label}</li>`
    if (this.children.length) {
      const children = this.children.map(child => child.makeHTML())
      html = `<li>${this.label}<ul>${children.join()}</ul></li>`
    }
    return html
  }
}

class Outliner {
  blocks: Outlineable[]

  constructor(blocks: Outlineable[]) {
    this.blocks = blocks
  }

  outline(depth: number = 0) {
    let outlines: Outlineable[] = [];
    let root: Outlineable|undefined = undefined;

    while (this.blocks.length > 0) {
      let block = this.blocks[this.blocks.length-1]
      console.log(`[${depth}] IT`, block.label, root?.label)

      // NO Root
      if (root === undefined) {
        console.debug(`[${depth}] Creating Root: '${block.label}`)
        root = this.blocks.pop()
      } 
      
      // Root Exists
      else {
        if (root.style < block.style || root.indent < block.indent ) {
          console.debug(`[${depth}] Handling Children of Block '${block.label}'`)
          block.children = this.outline(depth+1)
          console.debug(`[${depth}] Appending Child '${block.label}' to root '${root.label}'`)
          // root.children.push(block)
        } else {
          console.log(`[${depth}] Not a child '${block.label}' of root '${root.label}'`, this.blocks.length)
          outlines.push(root)
          return outlines
        }
      }
    }

    console.log("Blocks empty")
    if (root !== undefined) {
      outlines.push(root)
    }

    return outlines
  }

  static makeOutline(blocks: Outlineable[]): Outlineable {
    const outliner = new Outliner(blocks);

    let root = Outlineable.new("ROOT", 0, 0)
    root.children = outliner.outline()
    return root
  }
}

window.addEventListener("load", () => {
  const button = document.getElementById('btn-execute');

  // const block = craft.blockFactory.textBlock({
  //   content: "Hello world!"
  // });

  // craft.dataApi.addBlocks([block]);
  button?.addEventListener("click", () => {
    let blocks: Outlineable[] = [
      Outlineable.new("ROOT",  -1, 0),
      Outlineable.new("1",      0, 0),
      Outlineable.new("1.1",    1, 0),
      Outlineable.new("1.1.1",  2, 0),
      // Outlineable.new("1.1.2",  2, 0),
      // Outlineable.new("1.2",    1, 0),
      // Outlineable.new("1.3",    1, 0),
      Outlineable.new("2",      0, 0),
      Outlineable.new("2.1",    1, 0),
      // Outlineable.new("2.1.1",  2, 0),
      // Outlineable.new("2.1.2",  2, 0),
      // Outlineable.new("2.1.3",  2, 0),
      // Outlineable.new("2.1.4",  2, 0),
      // Outlineable.new("2.2",    2, 0),
      // Outlineable.new("2.3",    2, 0),
      Outlineable.new("3",      0, 0),
    ]

    blocks.reverse()
    let outline = Outliner.makeOutline(blocks)
    outline.log()

    let container = document.getElementById('document-outline-container')
    if (container === undefined) {
      console.log("HELLO THERE")
    }
    container!.innerHTML = outline.makeHTML()
  })
  const logoImg = document.getElementById('craftx-logo') as HTMLImageElement
  logoImg.src = craftXIconSrc;
})
