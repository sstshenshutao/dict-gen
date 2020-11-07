import React, { useEffect } from 'react';
import styles from './index.less';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveAs } from 'file-saver';

const corePermutation = (words) => {
  const upperFirstC = w => w[0].toUpperCase() + w.slice(1);

  //首字母小写
  words = words.map((w) =>
    w[0].toLowerCase() + w.slice(1),
  );
  let outArray = [];
  words.forEach(w1 => {
    words.forEach(w2 => {
      outArray.push(
        //生成camel规范
        w1 + upperFirstC(w2),
        //生成pascal规范
        upperFirstC(w1) + upperFirstC(w2),
        //生成下划线规范
        w1 + '_' + w2,
        //生成连字符规范
        w1 + '-' + w2,
      );
    });

  });
  return outArray;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 600,
      maxHeight: 100,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 1),
    },
  }),
);

const generate = (pw: string, index: number) => (
  <ListItem key={index}>
    <ListItemText
      primary={`${index + 1}: ${pw}`}
    />
  </ListItem>
);

export default function MainPage() {
  const classes = useStyles();
  const [passwords, setPasswords] = React.useState([]);
  const [passwordItems, setPasswordItems] = React.useState([]);
  const [readDiagOpen, setReadDiagOpen] = React.useState(false);
  // let inputPassword = '';
  const appendPassword = () => {
    let inPw = document.getElementById('word-text-field');
    console.log(inPw.value);
    let rds = [...passwords];
    console.log(rds);
    let inputStr = inPw.value.toString();
    if (!rds.includes(inputStr) && inputStr.length > 0) {
      rds.push(inputStr);
    }
    inPw.value = '';
    setPasswords(rds);
    console.log(rds);
    setPasswordItems(
      rds.map((pw, index) => generate(pw, index)),
    );
  };
  const downloadDic = () => {
    let outputTxt = corePermutation(passwords).reduce((accumulator, currentValue) => accumulator + '\n' + currentValue);
    console.log('outputTxt', outputTxt);
    let blob = new Blob([`${outputTxt}`], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'dict.txt');
  };
  const downloadWords = () => {
    let outputTxt = passwords.reduce((accumulator, currentValue) => accumulator + '\n' + currentValue);
    console.log('outputTxt', outputTxt);
    let blob = new Blob([`${outputTxt}`], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'words.txt');
  };
  const handleReadDiagClose = () => {
    setReadDiagOpen(false);
  };
  const handleReadDiagRead = () => {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    handleReadDiagClose();
    let rdPws = document.getElementById('read-diag-data');
    let rds = rdPws.value.toString().split('\n');
    rds = rds.concat(passwords);
    //去掉空行
    rds = rds.filter((currentValue) => currentValue.length !== 0);
    //去掉重复
    rds = rds.filter(onlyUnique);
    setPasswords(rds);
    setPasswordItems(
      rds.map((pw, index) => generate(pw, index)),
    );
  };
  const ReadDiag = () => (
    <div>
      <Dialog open={readDiagOpen} onClose={handleReadDiagClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            分隔符\n 按行输入
          </DialogContentText>
          <TextField
            autoFocus
            multiline={true}
            margin="dense"
            id="read-diag-data"
            label="data"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReadDiagClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReadDiagRead} color="primary">
            Read
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  const textFieldHandleKeyDown = (e) => {
    if (e.key === 'Enter') {
      appendPassword();
    }
  };
  return (
    <div className={classes.root}>
      {/*增加密码用*/}
      <TextField id="word-text-field" label="添加词汇" onKeyDown={textFieldHandleKeyDown}/>
      <Button variant="contained" color="secondary" onClick={() => appendPassword()}>
        添加
      </Button>
      {/*读入密码*/}
      <Button variant="contained" color="secondary" onClick={() => setReadDiagOpen(true)}>
        读入
      </Button>
      {/*输出字典*/}
      <Button variant="contained" color="secondary" onClick={() => downloadDic()}>
        输出字典
      </Button>
      <Button variant="contained" color="secondary" onClick={() => downloadWords()}>
        输出单词用于下次
      </Button>
      {/*显示用的*/}
      <div className={classes.demo}>
        <List>
          {passwordItems}
        </List>
      </div>
      {/*对话框*/}
      {ReadDiag()}
    </div>
  );
}
