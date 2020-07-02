"""
simple arithmetic expression parser

expr ::= num | num bin_op expr | (expr)

learnings:
    preferred recursion. select num expansion last to avoid premature return

challenges:
    -how to handle the general form, e-> e op e, without left recursion
    -operator precedence
    -build a parse tree
"""

import lex

class ASTNode:
    pass

class AST:
    pass

class BaseParser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.idx = -1
    
    def next(self):
        self.idx += 1
        return self.tokens[self.idx]
    
    def parse(self):
        pass
"""
    Recursive descent parser
"""
class RDParser(BaseParser):
    def __init__(self, tokens):
        super().__init__(tokens)
        print(self.tokens)

    def parse(self):
        if self.E():
            if self.EOF():
                print("Success")
            else: 
                print("Failed.")
        else: 
            print("Failed")

    def E(self):
        temp = self.idx
        if self.backtrack(temp) and self.Num() and self.bin_op() and self.E():
            return True
        elif self.backtrack(temp) and self.O_PAR() and self.E() and self.C_PAR():
            return True
        elif self.backtrack(temp) and self.Num():
            return True
        else: 
            return False

    def backtrack(self, temp):
        self.idx = temp
        return True

    def Num(self):
        t = self.next()
        if t.token.type == "NUM":
            return True

    def bin_op(self):
        t = self.next()
        if t.token.type == "BIN_OP":
            return True

    def O_PAR(self):
        t = self.next()
        if t.token.type == "O_PAR":
            return True
    
    def C_PAR(self):
        t = self.next()
        if t.token.type == "C_PAR":
            return True

    def EOF(self):
        t = self.next()
        if t.token.type == "EOF":
            return True

"""
    5*3+4:

         4
        /
       + 
     /  \
    *    3
     \
       5
"""

if __name__ == '__main__':
    text = "((1)+(3*2))"
    l = lex.Lexer(text)
    l.scan()

    p = RDParser(l.tokens)
    p.parse()