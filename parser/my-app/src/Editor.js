class Lexer {
    constructor(text) {
        this.text = text
        this.curr_token = null
        this.line_no    = 0
        this.tokens = []
    };

    tokenize(char) {
        let t = new Token(char, this.line_no);
        if (t.token.type == "NEW_LINE") {
            this.line_no += 1;
            return
        } else if (t.token.type == "SPACE") {
            return
        } else if (t.token.type == "NUM") {
            if (this.curr_token == null) {
                this.curr_token = t;
            } else {
                if (this.curr_token.token.type == "NUM") {
                    this.curr_token.eat(t);
                    return
                } else {
                    this.curr_token = t;
                }       
            }
        } else {
            this.curr_token = t;
        }
        
        this.tokens.push(this.curr_token)
    };

    scan() {
        for (let i = 0; i < this.text.length; i++) {
            const ch = this.text[i];
            this.tokenize(ch) 
        }    
        this.tokens.push(new Token("EOF", this.line_no))
    } 
}


class BaseParser {
    constructor(this, tokens) {
        this.tokens = tokens
        this.idx = -1
    }
    
    next() {
        this.idx += 1
        return this.tokens[this.idx]
    }

    parse() {
        return
    }       
}

// Recursive descent parser

class RDParser extends BaseParser {
    constructor(tokens) {
        super(tokens)
    }
        
     parse() {
        if (this.E()) {
            if (this.EOF()) {
                print("Success")
            }
            else {
                print("Failed.")
            }
        }    
        else {
            print("Failed")
        }   
     }
        

    E() {
        let temp = this.idx
        if (this.backtrack(temp) && this.Num() && this.bin_op() && this.E()) {
            return true
        }
        else if (this.backtrack(temp) && this.O_PAR() && this.E() && this.C_PAR()) {
            return true
        }
        else if (this.backtrack(temp) && this.Num()){
            return true
        }
        else {
            return false
        }
    }
        
    backtrack(temp) {
        this.idx = temp
        return true
    }

    Num(){
        let t = this.next()
        if (t.token.type == TOKENS.NUM) {
            return true
        }
        return false
    }
        

    bin_op() {
        let t = this.next()
        if (t.token.type == TOKENS.BIN_OP) {
            return true
        }
        return false
    }

    O_PAR() {
        let t = this.next()
        if (t.token.type == TOKENS.O_PAR){
            return true
        }
            return false
    }
    
    C_PAR() {
        let t = this.next()
        if (t.token.type == TOKENS.C_PAR) {
            return true
        }
            return false
    }
        

    EOF() {
        let t = this.next()
        if (t.token.type == TOKENS.EOF) {
            return true
        }
            return false
    }
        
}

class TreeNode {
    constructor(label, value, id) {
        this.label = label
        this.value = value
        this.id = id
        this.children = []
        this.parent = null
    }

    addChild(child) {
        this.children.push(child)
    }

    to_object() {
        let o = new Object()
        o.label = this.label
        o.value = this.value
        o.id = this.id
        o.children = []
        o.parent = this.parent
        if (this.children.length != 0) {
            this.children
           .forEach(n => {
              o.children.push(n.to_object());
           });
        }
        return o;
    }
}


class Tree {
    constructor() {
        this.root = new TreeNode("root", "PROG", 0)
        this.node_count = 1
    }

    addChild(node, label, value) {
        let n = new TreeNode(label, value, this.node_count);
        n.parent = node
        node.addChild(n)
        this.node_count = this.node_count + 1
    }

    to_json() {
        return this.root.to_object()
    }

    bfs(node) {
        let q = [];
        let explored = new Set();
        q.push(node);
     
        explored.add(node.id);
     
        while (q.length != 0) {
           let t = q.shift();
           console.log(t)
           // 1. In the edges object, we search for nodes this node is directly connected to.
           // 2. We filter out the nodes that have already been explored.
           // 3. Then we mark each unexplored node as explored and add it to the queue.
           t.children
           .filter(n => !explored.has(n.id))
           .forEach(n => {
              explored.add(n.id);
              q.push(n);
           });
        }
    }
}

class TreeViz {

    constructor() {
        this.ptree = new Tree("root", "PROG")
    }

    draw(expr) {

        let ttree = function main(expr) {
          let l = new Lexer(expr)
          l.scan()
          console.log("begin parsing")
          //console.log(ptree);
          let ptree = new Tree("root", "PROG");
          let p = new RDParser(l.tokens, ptree)
          console.log(ptree);
          return p.parse()
        }(expr)

        if (ttree != null) {
            this.ptree = ttree
        }
        
        return vgraph(this.ptree.to_json());
      }
}

function draw(expr) {

    let ptree = function main(expr) {
      let l = new Lexer(expr)
      l.scan()
      console.log("begin parsing")
      //console.log(ptree);
      let ptree = new Tree("root", "PROG");
      let p = new RDParser(l.tokens, ptree)
      console.log(ptree);
      return p.parse()
    }(expr)
    
    //const val = div.querySelector("[type=text]");
    // val.addEventListener("input", () => {
    //                                   console.log(val.value);
    //                                   main(val.value);
    //                                 }
    //                     );
    return vgraph(ptree.to_json());
  }


function AST(ptree) {
  
    let ast = new Tree("","");

    class astNode {
        constructor() {
            this.label = "";
            this.children = [];
            this.parent = null;
        }
    }

    function collapse(node, parent) {
      
      let n = new TreeNode("","");

      if (node.children.length == 1) {
            n = collapse(node.children[0], node);
      } else if (node.children.length == 3) {
            let orphans = node.children
            // middle child is the operator
            n = collapse(orphans[1]);
            n.children = []
            if (orphans[0].value != "(") {
                collapse(orphans[0], n);
                collapse(orphans[2], n)
            }
      }

      n.parent = parent;
      if (parent != null) {
          parent.children.push(n)
      }

      return n
    }

      ast.root = collapse(R.clone(ptree.root), null)
      return ast;
}

function tokenize(text) {
    
    const TOKENS = Object.freeze({"CHAR":0, "STR": 1, "HYPHEN":2, "WSPACE":3, "EOF":4 });
    const CHAR = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])
    
    Tokens = Object.freeze({
        "WSPACE":new Set([" ","\t"]),
        "NEW_LINE": "\n"
    })

    class BasicToken {

        constructor(char, line_no){

            if (CHAR.has(char)) {
                this.type = "STR"
            }
            else if (Tokens.WSPACE.has(char)){
                this.type = "WSPACE"
            } else if (char == Tokens.NEW_LINE){
                this.type = "NEW_LINE"
            }else if (char == "EOF") {
                this.type = "EOF"
            } else {
                  console.log("error");
                // raise ValueError(f"Unknown token {char} at line {line_no}")
            }
    
            this.symbol = char
            this.line = line_no

        }
    }

    class Token {
        constructor(char, line_no) {
            this.token = new BasicToken(char, line_no);
        };
           
        eat(token) {
            this.token.symbol = this.token.symbol + token.token.symbol;
        }
    }

    class Lexer {
        constructor(text) {
            this.text = text
            this.curr_token = null
            this.line_no    = 0
            this.tokens = []
        };
    
        tokenize(char) {
            let t = new Token(char, this.line_no);
            if (t.token.type == "NEW_LINE") {
                this.line_no += 1;
                return
            } else if (t.token.type == "WSPACE") {
                return
            } else if (t.token.type == "STR") {
                if (this.curr_token == null) {
                    this.curr_token = t;
                } else {
                    if (this.curr_token.token.type == "STR") {
                        this.curr_token.eat(t);
                        return
                    } else {
                        this.curr_token = t;
                    }       
                }
            } else {
                this.curr_token = t;
            }
            
            this.tokens.push(this.curr_token)
        };
    
        scan() {
            for (let i = 0; i < this.text.length; i++) {
                const ch = this.text[i];
                this.tokenize(ch) 
            }    
            this.tokens.push(new Token("EOF", this.line_no))
        } 
    }
}