import {Appliable} from "@/utils/Appliable";
import {Crop} from "@/tools/Crop";
import {Ellipse} from "@/tools/Ellipse";
import {Fill} from "@/tools/Fill";
import {Eraser} from "@/tools/Eraser";
import {Select} from "@/tools/Select";
import {Resize} from "@/tools/Resize";
import {Rect} from "@/tools/Rect";
import {Pen} from "@/tools/Pen";
import {Move} from "@/tools/Move";
import {Line} from "@/tools/Line";
import {Painter} from "@/utils/Painter";
import {Img} from "@/tools/Img";
import {Text} from "@/tools/Text";
import {Tool} from "@/types/model";

class Tools {
  public crop: Tool;
  public ellipse: Tool;
  public eraser: Tool;
  public fill: Tool;
  public img: Tool;
  public line: Tool;
  public move: Tool;
  public pen: Tool;
  public rect: Tool;
  public resize: Tool;
  public select: Tool;
  public text: Tool;

  constructor(painter: Painter) {
    this.crop = new Crop(painter);
    this.ellipse = new Ellipse(painter);
    this.eraser = new Eraser(painter);
    this.fill = new Fill(painter);
    this.img = new Img(painter);
    this.line = new Line(painter);
    this.move = new Move(painter);
    this.pen = new Pen(painter);
    this.rect = new Rect(painter);
    this.resize = new Resize(painter);
    this.select = new Select(painter);
    this.text = new Text(painter);
  }

}


export {Tools};
