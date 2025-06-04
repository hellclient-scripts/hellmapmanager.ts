//简易的带控制码的字符串转换类
//共有3个状态
//1.转义字符串，用于储存。用于人工读写的格式。
//2.控制码字符串，用于根据控制码进行附加操作，用于根据控制码进行操作。
//3.原始字符串，实际使用的字符串，代码中使用的实际业务格式。
//字符串共有3种操作
//Escape:原生字符串到转义字符串，a=>\a.对应Unescape
//Unpack:编码:转义字符串=>控制码字符串,\a=>%61对应Pack
//Decode:控制码到原生字符串,%61=>a,对应Encode

//命令实例，包含原始字符串，原始代码字符串和转义字符串。
//为了避免不可预期表现，原始代码字符串应该有独立的取值空间，不会被raw和escaped中使用。
export class Command {
    constructor(raw: string, rawcode: string, escaped: string) {
        this.Raw = raw;
        this.EncodedCode = ControlCode.EncodeCommand(rawcode);
        this.Escaped = escaped;
        this.Encoded = ControlCode.PreEscape(raw);
    }
    static New(raw: string, rawcode: string, escaped: string): Command {
        return new Command(raw, rawcode, escaped);
    }
    //转义后的字符
    Escaped: string;
    //编码后的控制代码
    EncodedCode: string;
    //原始字符
    Raw: string;
    //预处理后的字符，用于避免内部Token转换的问题
    Encoded: string
}
export class ControlCode {
    //指令开始字符
    public static CodeStart: string = "\x02";
    //指令结束字符
    public static CodeEnd: string = "\x03";
    //指令开始/结束转义字符
    public static CodeEscape: string = "\x04";
    public static EncodedEscape: string = "\x04\x04";
    public static EncodedStart: string = "\x04\x05";
    public static EncodedEnd: string = "\x04\x06";
    static New(): ControlCode {
        return new ControlCode();
    }
    static PreEscape(val: string): string {
        return val.replaceAll(ControlCode.CodeEscape, ControlCode.EncodedEscape).replaceAll(ControlCode.CodeEnd, ControlCode.EncodedEnd).replaceAll(ControlCode.CodeStart, ControlCode.EncodedStart);
    }
    public static PreUnescape(val: string): string {
        return val.replaceAll(ControlCode.EncodedStart, ControlCode.CodeStart).replaceAll(ControlCode.EncodedEnd, ControlCode.CodeEnd).replaceAll(ControlCode.EncodedEscape, ControlCode.CodeEscape);
    }
    public static EncodeCommand(val: string): string {
        return ControlCode.CodeStart + ControlCode.PreEscape(val) + ControlCode.CodeEnd;
    }
    public Commands: Command[] = [];
    public WithCommand(command: Command): ControlCode {
        this.Commands.push(command);
        return this;
    }
    public Encode(val: string): string {
        val = ControlCode.PreEscape(val);
        for (let i = 0; i < this.Commands.length; i++) {
            let c = this.Commands[i];
            if (c.Encoded !== c.EncodedCode && c.Encoded !== "") {
                val = val.replaceAll(c.Encoded, c.EncodedCode);
            }
        }
        return val;
    }
    public Decode(val: string): string {
        for (let i = 0; i < this.Commands.length; i++) {
            let c = this.Commands[i];
            if (c.Raw !== c.EncodedCode && c.EncodedCode !== "") {
                val = val.replaceAll(c.EncodedCode, c.Encoded);
            }
        }
        val = ControlCode.PreUnescape(val);
        return val;
    }

    public Pack(val: string): string {
        for (let i = 0; i < this.Commands.length; i++) {
            let c = this.Commands[i];
            if (c.EncodedCode !== c.Escaped && c.EncodedCode !== "") {
                val = val.replaceAll(c.EncodedCode, c.Escaped);
            }
        }
        val = ControlCode.PreUnescape(val);
        return val;
    }
    public Unpack(val: string): string {
        val = ControlCode.PreEscape(val);
        for (let i = 0; i < this.Commands.length; i++) {
            let c = this.Commands[i];
            if (c.EncodedCode !== c.Escaped && c.Escaped !== "") {
                val = val.replaceAll(c.Escaped, c.EncodedCode);
            }
        }
        return val;
    }

    public Escape(val: string): string {
        val = this.Encode(val);
        val = this.Pack(val);
        return val;
    }
    public Unescape(val: string): string {
        val = this.Unpack(val);
        val = this.Decode(val);
        return val;
    }
}