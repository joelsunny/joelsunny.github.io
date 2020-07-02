# token definitions
class BasicToken:
    """
        single character tokens

        includes special tokens (EOF, NEW_LINE, UNK)
    """
    O_PAR = "("
    C_PAR = ")"
    PLUS  = "+"
    MUL   = "*"
    SUB   = "-"
    BIN_OP = {PLUS, SUB, MUL}
    DIGIT = {'0','1','2','3','4','5','6','7','8','9'}
    WSPACE = {" ", "\t"}

    def __init__(self, char, line_no):
        if char == "(":
            self.type = "O_PAR"
        elif char == ")":
            self.type = "C_PAR"
        elif char in BasicToken.BIN_OP:
            self.type = "BIN_OP"
        elif char in BasicToken.DIGIT:
            self.type = "NUM"
        elif char in BasicToken.WSPACE:
            self.type = "SPACE"
        elif char == "EOF":
            self.type = "EOF"
        else:
            raise ValueError(f"Unknown token {char} at line {line_no}")

        self.token = char
        self.line = line_no
    
    def __repr__(self):
        return(f"token: {self.token}, type: {self.type}, line: {self.line}")

class Token:
    def __init__(self, char, line_no):
        self.token = BasicToken(char, line_no)
        
    def is_extensible(self, token):
        pass

    def eat(self, token):
        self.token.token = self.token.token + token.token.token

    def __repr__(self):
        return(f"{self.token}")

class Lexer:
    def __init__(self, text):
        self.text = text
        self.curr_token = None
        self.line_no    = 0
        self.tokens = []

    def tokenize(self, char):
        """
            handle multi char tokens (NUM), white space, newline
        """
        t = Token(char, self.line_no)
        # print(t)
        if t.token.type == "NEW_LINE":
            self.line_no += 1
            return
        elif t.token.type == "SPACE":
            return
        elif t.token.type == "NUM":
            if self.curr_token == None:
                self.curr_token = t
            else: 
                if self.curr_token.token.type == "NUM":
                    self.curr_token.eat(t)
                    return
                else: 
                    self.curr_token = t
        else: 
            self.curr_token = t
        
        self.tokens.append(self.curr_token)

    def scan(self):
        for i, ch in enumerate(self.text):
            self.tokenize(ch)
            # print(self.tokens)
        
        self.tokens.append(Token("EOF", self.line_no))

if __name__ == '__main__':
    text = "3*51 +2"
    l = Lexer(text)
    l.scan()

