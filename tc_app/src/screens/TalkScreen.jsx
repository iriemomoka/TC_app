import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Platform, StyleSheet, View, Text, Alert, Keyboard, TouchableOpacity, TextInput, Linking, LogBox, BackHandler, AppState, Dimensions, Image, FlatList
} from 'react-native';
import { GiftedChat, Actions, Send, InputToolbar, Bubble, Time, Composer, Message, MessageText } from 'react-native-gifted-chat';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import GestureRecognizer from 'react-native-swipe-gestures';
import * as Haptics from 'expo-haptics';
import { useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import SideMenu from 'react-native-side-menu-updated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Loading from '../components/Loading';
import { MyModal0, MyModal1, MyModal2, MyModal3, MyModal4, MyModal5, MyModal6, MyModal7 } from '../components/Modal';

import { GetDB,db_select,db_write } from '../components/Databace';

LogBox.ignoreAllLogs()

// let domain = 'http://family.chinser.co.jp/irie/tc_app/';
let domain = 'https://www.total-cloud.net/';

const Width = Dimensions.get("window").width;

export default function TalkScreen(props) {
  
  if (AppState.currentState === 'active') {
    Notifications.setBadgeCountAsync(0);
  }
  
  const { navigation, route } = props;
  
  const [isLoading, setLoading] = useState(false);
  
  const [talk, setTalk] = useState([]);

  const [messages, setMessages] = useState([]);
  const [customer, setCustomer] = useState(false);
  const [staff, setStaff] = useState([]);
  const [tantou,setTantou] = useState('');
  const [options, setOptions] = useState(false);
  const [video_option, setVideo_option] = useState(false);
  const [overlap, setOverlap] = useState(false);
  const [contract_sms, setContract_sms] = useState(null);
  
  const [menu, setMenu] = useState(false);
  const [modal0, setModal0] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [modal4, setModal4] = useState(false);
  const [modal5, setModal5] = useState(false);
  const [modal6, setModal6] = useState(false);
  const [modal7, setModal7] = useState(false);
  
  const [modal3_flg, setModal3_flg] = useState("property");
  const [modal4_flg, setModal4_flg] = useState("fixed");

  const [carouselList, setCarouselList] = useState([]);

  const [reservation,setReservation] = useState([]);
  const [mail, setMail] = useState([]);
  const [msgtext,setMsgtext] = useState('');
  const [subject,setSubject] = useState('');
  const [focus, setFocus] = useState(false);

  // 返信用
  const [note_ret,setNoto_ret] = useState('');
  const [send_mail,setSend_mail] = useState('');
  const [receive_mail,setReceive_mail] = useState('');
  
  const [add, setAdd] = useState([]);
  
  const [property,setProperty] = useState(false);
  const [conditions_date,setConditions_date] = useState(false);
  const [inquiry,setInquiry] = useState(false);
  const [inquiry_text,setInquiry_text] = useState(false);
  const [inquiry_name,setInquiry_name] = useState(false);
  
  const [station,setStation] = useState([]);
  const [address,setAddress] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [comment, setComment] = useState([]);
  
  const [inputCursorPosition, setInputCursorPosition] = useState(null);

  const [sidemenu, setSideMenu] = useState(false);

  const [reload, setReload] = useState("");
  const [reload2, setReload2] = useState("");

  navigation.setOptions({
    headerStyle: !global.fc_flg?{ backgroundColor: '#6C9BCF', height: 110}:{ backgroundColor: '#FF8F8F', height: 110},
  });
  
  // 端末の戻るボタン
  const backAction = () => {
    if (!isLoading) {
      if(msgtext) {
        Alert.alert(
          "入力されたテキストは消えますが\nよろしいですか？",
          "",
          [
            {
              text: "はい",
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{
                    name: route.previous=="Schedule"||route.previous=="WorkProgress"?route.previous:"CommunicationHistory",
                    params: route.params,
                    websocket:route.websocket,
                    websocket2: route.websocket2,
                    profile:route.profile,
                    previous:'TalkScreen',
                    reload:reload,
                    withAnimation2: true
                  }],
                });
              }
            },
            {
              text: "いいえ",
            },
          ]
        );
      } else {
        navigation.reset({
          index: 0,
          routes: [{
            name: route.previous=="Schedule"||route.previous=="WorkProgress"?route.previous:"CommunicationHistory",
            params: route.params,
            websocket:route.websocket,
            websocket2: route.websocket2,
            profile:route.profile,
            previous:'TalkScreen',
            reload:reload,
            withAnimation2: true
          }],
        });
      }
    }
    return true;
  };
  
  useEffect(() => {
    
    navigation.setOptions({
      headerTitle:() => (<Text style={styles.name}>{route.cus_name}</Text>),
      headerLeft: () => (
          <Feather
            name='chevron-left'
            color='white'
            size={30}
            onPress={() => {
              if (!isLoading) {
                if(msgtext) {
                  Alert.alert(
                    "入力されたテキストは消えますが\nよろしいですか？",
                    "",
                    [
                      {
                        text: "はい",
                        onPress: () => {
                          navigation.reset({
                            index: 0,
                            routes: [{
                              name: route.previous=="Schedule"||route.previous=="WorkProgress"?route.previous:"CommunicationHistory",
                              params: route.params,
                              websocket:route.websocket,
                              websocket2: route.websocket2,
                              profile:route.profile,
                              previous:'TalkScreen',
                              reload:reload,
                              withAnimation2: true
                            }],
                          });
                        }
                      },
                      {
                        text: "いいえ",
                      },
                    ]
                  );
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{
                      name: route.previous=="Schedule"||route.previous=="WorkProgress"?route.previous:"CommunicationHistory",
                      params: route.params,
                      websocket:route.websocket,
                      websocket2: route.websocket2,
                      profile:route.profile,
                      previous:'TalkScreen',
                      reload:reload,
                      withAnimation2: true
                    }],
                  });
                }
              }
            }}
            style={{padding:10}}
          />
      ),
      headerRight: () => (
        <View style={{flexDirection:"row"}}>
          {(customer.main&&(customer.main.tel1||customer.main.tel2||customer.main.tel3))&&(
            <TouchableOpacity
            style={{width:50,height:60,justifyContent:'center',alignItems:'center'}}
              onPress={() => {
                var TEL = "";
                if (customer.main.tel1) {
                  TEL = customer.main.tel1;
                } else if (customer.main.tel2) {
                  TEL = customer.main.tel2;
                } else if (customer.main.tel3) {
                  TEL = customer.main.tel3;
                }
                const phoneNumber = `tel:${TEL}`;
                Linking.openURL(phoneNumber);
              }}
            >
              <MaterialCommunityIcons
                name="phone"
                color="white"
                size={35}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{width:50,height:60,justifyContent:'center',alignItems:'center'}}
            onPress={() => {
              setSideMenu(!sidemenu);
            }}
          >
            <Feather
              name="menu"
              color="white"
              size={35}
            />
          </TouchableOpacity>
        </View>
      ),
      
    });
    
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
    
  }, [msgtext,isLoading,reload,customer])
  
  useEffect(() => {
    
    Display();
    GetDB('station_mst').then(station_mst=>station_mst!=false&&setStation(station_mst));
    GetDB('address_mst').then(address_mst=>address_mst!=false&&setAddress(address_mst));
    GetDB('fixed_mst').then(fixed_mst=>fixed_mst!=false&&setFixed(fixed_mst));
    GetDB('comment_mst').then(comment_mst=>comment_mst!=false&&setComment(comment_mst));

    // 通知をタップしたらお客様一覧 → トーク画面 (ログイン済)
    const notificationInteractionSubscription =
      Notifications.addNotificationResponseReceivedListener(async(response) => {
        if (
          response.notification.request.content.data.customer &&
          global.sp_id
        ) {
          const cus_data = response.notification.request.content.data.customer;

          navigation.reset({
            index: 0,
            routes: [
              {
                name: "TalkScreen",
                params: route.params,
                customer: cus_data.customer_id,
                websocket: route.websocket,
                websocket2: route.websocket2,
                profile: route.profile,
                cus_name: cus_data.name,
              },
            ],
          });
        }
        if (
          response.notification.request.content.data.room_id &&
          global.sp_id
        ) {
          const room_id = response.notification.request.content.data.room_id;

          var sql = `select * from chat_room where del_flg != '1' and room_id = '${room_id}';`;
          var rooms_ = await db_select(sql);
          
          if (rooms_ != false) {
            var room = rooms_[0];
    
            if (room["room_type"] == "0") {
    
              var user_id = room["user_id"].split(',');
    
              var account = user_id.filter(function(id) {
                return id !== route.params.account;
              });
    
              var sql = `select * from staff_all where account = '${account[0]}';`;
              var staff = await db_select(sql);
    
              if (staff != false) {
                room["account"]      = account[0];
                room["name_1"]       = staff[0]["name_1"];
                room["name_2"]       = staff[0]["name_2"];
                room["shop_id"]      = staff[0]["shop_id"];
                room["shop_name"]    = staff[0]["shop_name"];
                room["staff_photo1"] = staff[0]["staff_photo1"];
              }
    
            }

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "ChatTalk",
                  params: route.params,
                  websocket: route.websocket,
                  websocket2: route.websocket2,
                  profile: route.profile,
                  room: room
                },
              ],
            });

          }
        }
        if (
          response.notification.request.content.data.timeline &&
          global.sp_id
        ) {
          const tl_data = response.notification.request.content.data.timeline;
          navigation.navigate(
            'Post',{
              name: 'Post' ,
              params: route.params,
              websocket:route.websocket,
              websocket2: route.websocket2,
              profile:route.profile,
              previous:'TimeLine',
              post: tl_data,
              flg:tl_data["flg"],
            }
          );
        }
        if (
          response.notification.request.content.data.thank &&
          global.sp_id
        ) {
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Thanks' ,
              params: route.params,
              websocket:route.websocket,
              websocket2: route.websocket2,
              profile:route.profile,
              previous:'TimeLine',
              flg:1
            }],
          });
        }
    });

    return () => {
      notificationInteractionSubscription.remove();
    };
    
  }, [])

  useEffect(() => {
    if(reload2) {
      setModal5(false);
      setModal6(false);
      onRefresh(true);
    }
  }, [reload2])
  
  async function Display() {

    if (!route.customer) {

      Alert.alert('','このお客様データは削除されています');
      
      navigation.reset({
        index: 0,
        routes: [{
          name: 'CommunicationHistory' ,
          params: route.params,
          websocket:route.websocket,
          websocket2: route.websocket2,
          profile:route.profile,
          previous:'TalkScreen'
        }],
      });

      return;
    }

    var loadflg = false;

    var sql = `select count(*) as count from communication_mst where customer_id = '${route.customer}';`;
    var customer = await db_select(sql);
    const cnt = customer[0]["count"];

    if (cnt == 0) loadflg = true;

    await getLocalDB(loadflg);
    onRefresh(loadflg);

  }

  const getLocalDB = async(flg) => {

    setLoading(true);

    var sql = `select * from communication_mst where ( customer_id = '${route.customer}' ) order by time desc;`;
    var talk_ = await db_select(sql);
    if (talk_ != false) {
      var newTalk = [];
      for(var t=0;t<talk_.length;t++) {
        var val = talk_[t];
        if (val["file_path"]) {
          val["file_path"] = val["file_path"].split(',')
        }
        newTalk.push(val)
      }
      setTalk(newTalk);
    }

    if (!flg) setLoading(false);

    const staff_mst = await GetDB('staff_mst');
    if (staff_mst != false) setStaff(staff_mst[0]);

    var sql = `select * from customer_mst where ( customer_id = '${route.customer}' );`;
    var customer_mst = await db_select(sql);
    if (customer_mst != false) {
      const cus = customer_mst[0];
      const cusData = {
        line: cus["line"],
        main: {
          customer_id: cus["customer_id"],
          name: cus["name"],
          tel1: cus["tel1"],
          mail1: cus["mail1"],
          mail2: cus["mail2"],
          mail3: cus["mail3"],
          status: cus["status"],
          brower_mail: "",
        },
        reverberation: {
          user_id: cus["reverberation_user_id"],
          staff_name: cus["staff_name"],
          media: cus["media"],
          inquiry_day: "",
        }
      }
      setCustomer(cusData);
    }

  }

  const onRefresh = useCallback(async(flg) => {

    console.log('--------------------------');

    if (flg) setLoading(true);

    const startTime = Date.now(); // 開始時間
    
    const json = await getCOM();

    // ログアウトしてたら中断
    if(!global.sp_token && !global.sp_id) return;

    if (json != false) {
      
      setTalk(json['communication']);

      if (json['customer_data']['main'] == null) {

        Alert.alert('','このお客様データは削除されています');
        
        navigation.reset({
          index: 0,
          routes: [{
            name: 'CommunicationHistory' ,
            params: route.params,
            websocket:route.websocket,
            websocket2: route.websocket2,
            profile:route.profile,
            previous:'TalkScreen'
          }],
        });

        return;
      }

      setCustomer(json['customer_data']);
      setStaff(json['staff']);
      setReservation(json['customer_reservation']);
      setProperty(json['article_list']);
      setConditions_date(json['conditions_date']);
      setInquiry(json['inquiry']);
      setOptions(json['staff'].option_list.split(","));
      setOverlap(json['overlap']);
      setContract_sms(json['contract_sms']);

      // 店舗オプション（ビデオ通話）
      if ((json['staff'].option_list.split(",")).includes('14')) {
        setVideo_option(true);
      }

      // 重複チェック
      if (json['overlap']) {
        if((json['overlap'].overlap == '1' || json['overlap'].overlap == '2' || json['overlap'].overlap == '3')) {
          setModal6(true);
        }
      }

      // 反響・来店ともに担当者無し→反響担当者
      if (!json['customer_data'].reverberation.user_id && json['customer_data'].main.status == '未対応') {
        setTantou('反響');
        setModal5(true);
      }

      setLoading(false);

      // 入居申込書のURL開く
      if (route.erc_send) {
        const erc_url = route.erc_send.url;
        if (route.erc_send.flg == "mail") {
          setNoto_ret(erc_url);
          setMenu(true);
          setModal1(true);
        } else if (route.erc_send.flg == "line") {
          setMsgtext(erc_url);
          setFocus(true);
        }
      }

      const endTime = Date.now(); // 終了時間
      const time = (endTime - startTime)/1000;
      console.log('トーク取得：'+time + '秒')

      await Insert_communication_db(json['communication']);

      const endTime2 = Date.now(); // 終了時間
      const time2 = (endTime2 - startTime)/1000;
      console.log('トーク登録：'+time2 + '秒')

    } else {

      var sql = `select * from communication_mst where ( customer_id = '${route.customer}' ) order by time desc;`;
      var talk_ = await db_select(sql);

      var newTalk = [];

      if (talk_ != false) {
        for(var t=0;t<talk_.length;t++) {
          var val = talk_[t];
          if (val["file_path"]) {
            val["file_path"] = val["file_path"].split(',')
          }
          newTalk.push(val)
        }
      }
      
      setTalk(newTalk);
      
      const errTitle = 'ネットワークの接続に失敗しました';
      const errMsg = '直近の'+talk_.length+'件のメッセージのみ表示します\n※送受信やおすすめ物件、画像の表示などはできません'
      Alert.alert(errTitle,errMsg);

      setLoading(false);
    }

    return;

  }, []);

  const getCOM = useCallback(() => {
    
    return new Promise((resolve, reject)=>{
      fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          ID : route.params.account,
          pass : route.params.password,
          act:'get_talk',
          img_flg:1,
          customer_id:route.customer,
          fc_flg: global.fc_flg
        })
      })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        console.log(error);
        resolve(false);
      });
    })

  });
  
  // websocket通信(繋がった)
  route.websocket.onopen = (open) => {
    console.log('open');
  };
  
  // websocket通信(メール届いたら更新)
  route.websocket.onmessage = (message) => {
    let catchmail_flg = JSON.parse( message.data );
    onRefresh(false);
  }
  
  // websocket通信(切断したら再接続)
  route.websocket.onclose = (close) => {
    
    if (global.sp_token & global.sp_id) {
      console.log('closed');
      const WS_URL = 'ws://54.168.20.149:8080/ws/'+route.params.shop_id+'/'
      navigation.reset({
        index: 0,
        routes: [{
          name: 'TalkScreen' ,
          params: route.params ,
          customer:route.customer,
          websocket:new WebSocket(WS_URL),
          websocket2: route.websocket2,
          profile:route.profile,
        }],
      });
    }
    
  }
  
  useEffect(() => {
    if(inquiry) {
      setInquiry_name(inquiry[0].article_name)
      var inquiry_data = inquiry.map(i => {
      const i_data = i.article_name+' '+i.room_no+"\n"+i.address+"\n"+i.line_name1+' '+i.station_name1+' '+(i.station_how_to1 == "徒歩"?i.station_how_to1+i.station_time1:i.station_how_to1 == "バス"?i.station_how_to1+i.bus_time1:'')+"分\n"+"賃料："+i.rent/10000+"万円\n"+"間取り："+i.layout+"\n"+"https://www.total-cloud.net/show/"+route.customer+"/1/"+i.article_id+"\n";
        return i_data;
      })
      setInquiry_text(inquiry_data);
    }
    
  }, [inquiry])
  
  useEffect(() => {
    
    if (talk != null && talk.length > 0) {
      var IndexList = {};
      const msg = talk.map(com => {

        if (com.del_flg){
          return
        }

        var img_flg = false;
        if (com.file_path != null && (com.file_path.length) > 0) {
          img_flg = true;
        }

        if(com.line_note && (com.line_note).indexOf("【物件挿入(カルーセル)】") === 0){
          IndexList[com.communication_id] = 0;
        }
        
        if (com.speaker === 'お客様') {
          const data = {
            _id:  com.communication_id,
            text: com.note+(com.line_note && com.title !== 'スタンプ'?com.line_note:''),
            image:img_flg?com.file_path:com.title === 'スタンプ'?'https://stickershop.line-scdn.net/stickershop/v1/sticker/'+com.line_note+'/iphone/sticker@2x.png':''
            ,
            createdAt: com.time,
            user: {
              _id: 2,
              name: com.speaker,
              avatar:null,
              status:com.status,
              title:com.title,
              html_flg:com.html_flg,
              user_read:0,
            }
          }
          return data;
        }else if (com.speaker === '店舗') {
          const data = {
            _id:  com.communication_id,
            text: com.note+(com.line_note?com.line_note:''),
            image:img_flg?com.file_path:'',
            createdAt: com.time,
            user: {
              _id: 1,
              name: com.speaker,
              avatar:null,
              status:com.status,
              title:com.title,
              html_flg:com.html_flg,
              user_read:0,
            }
          }
          return data;
        }
      }).filter(data => data);
      setMessages(msg);
      setCurrentIndex(IndexList);
    }

  }, [talk])

  const [currentIndex, setCurrentIndex] = useState({});

  const renderBubble = props => {
    
    const message_sender_id = props.currentMessage.user._id;
    const image = props.currentMessage.image;
    const stamp = props.currentMessage.user.title;
    
    return (
      <Bubble
        {...props}
        position={message_sender_id == 2 ? 'left' : 'right'}
        textStyle={{
          right: {
            fontSize: 12,
          },
          left: {
            fontSize: 12,
            color: '#1f2d53',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: 'white',
            borderWidth: 1.5,
            borderColor: !global.fc_flg?"#6C9BCF":"#FF8F8F",
            marginRight: 5,
            marginVertical: 5,
            maxWidth: '75%',
          },
          left: {
            backgroundColor: (stamp==='スタンプ'?'transparent':!global.fc_flg?"#d9faff":"#F4E1E4"),
            marginLeft: 5,
            marginVertical: 5,
            borderBottomLeftRadius: 1,
            maxWidth: '75%',
          },
        }}
      />
    );
    
  };

  const renderMessageText = props => {

    let carouselContent = props.currentMessage.text;

    if(carouselContent.indexOf("【物件挿入(カルーセル)】") === 0){
      return null;
    } else {
      return (<MessageText {...props} />)
    }

  }

  const flatListRefs = useRef({});
  const [carouselWidth, setCarouselWidth] = useState(230);

  const renderCarouselView = useCallback((props) => {

    let carouselContent = props.currentMessage.text;
    let id = props.currentMessage._id;

    if (carouselContent.indexOf("【物件挿入(カルーセル)】") === 0) {
      let c_i = currentIndex[id] ?? 0;

      if (carouselContent.indexOf("\r\n") > -1) {
        carouselContent = carouselContent.replace(/\r\n/g, '\n');
      }
      carouselContent = carouselContent.replace("【物件挿入(カルーセル)】\n", "").split("\n\n");
      carouselContent = carouselContent.filter(element => element !== "");

      const handleNextPress = () => {
        if (c_i < carouselContent.length - 1) {
          c_i = c_i + 1;
          flatListRefs.current[id]?.scrollToIndex({ index: c_i, animated: true });

          setCurrentIndex(c => ({...c,[id]: c_i}));
        }
      };

      const handlePrevPress = () => {
        if (c_i > 0) {
          c_i = c_i - 1;
          flatListRefs.current[id]?.scrollToIndex({ index: c_i, animated: true });

          setCurrentIndex(c => ({...c,[id]: c_i}));
        }
      };
      
      const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setCarouselWidth(width);
      };

      return (
        <View style={{margin:20,marginTop:10}} onLayout={handleLayout}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.carouselTxt}>【物件挿入(カルーセル)】</Text>
            <Text style={[styles.carouselTxt,{marginLeft:'auto'}]}>{String(currentIndex[id]+1)}/{String(carouselContent.length)}</Text>
          </View>
          <View style={styles.carousel}>
            {currentIndex[id] > 0&&(
              <TouchableOpacity
                style={[styles.carouselBtn, { left: -15, backgroundColor:!global.fc_flg?"#6C9BCF":"#FF8F8F" }]}
                onPress={handlePrevPress}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={"#fff"}
                  size={35}
                />
              </TouchableOpacity>
            )}
            <FlatList
              scrollEnabled={false}
              ref={(ref) => { flatListRefs.current[id] = ref; }}
              horizontal
              data={carouselContent}
              renderItem={({ item }) => {
                let logArray = item.split("\n");
                if (logArray.length < 2) return null;
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.property,{width:carouselWidth}]}
                    onPress={()=>{console.log(carouselWidth)}}
                  >
                    <Image
                      style={styles.propertyPhoto}
                      source={{ uri: logArray[0] }}
                    />
                    <Text style={styles.propertyTitle}>{logArray[1]}</Text>
                    <Text style={styles.propertyInfo}>{logArray[2]}駅</Text>
                    <TouchableOpacity
                      onPress={() => { Linking.openURL(logArray[3]) }}
                      style={styles.propertyBtn}
                    >
                      <Text style={styles.propertyBtn_txt}>詳細</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
            {currentIndex[id] < carouselContent.length - 1&&(
              <TouchableOpacity
                style={[styles.carouselBtn, { right: -15, backgroundColor: !global.fc_flg?"#6C9BCF":"#FF8F8F" }]}
                onPress={handleNextPress}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={"#fff"}
                  size={35}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }, [currentIndex,carouselWidth]);
  
  // コミュニケーション履歴データベース登録
  async function Insert_communication_db(communication){

    if (communication) {
      
      var del_list = []; // 削除リスト
      var count_   = 0;  // 20件までのカウント

      // 最新トーク
      talklist: for (var c=0;c<communication.length;c++) {

        var com = communication[c];

        if (count_ == 20) break;

        // 削除フラグは追加しない
        if (com.del_flg) {
          del_list.push(com);
          continue talklist;
        }

        var sql = `insert or replace into communication_mst values (?,?,?,?,?,?,?,?,?,?,?,?);`;
        
        var data = [
          com.communication_id,
          com.customer_id,
          com.speaker,
          com.time,
          com.title,
          com.note,
          com.line_note,
          com.file_path!=null&&(com.file_path).length>0?(com.file_path).join():"",
          com.status,
          com.html_flg,
          com.receive_mail,
          com.send_mail,
        ];

        count_++;
        await db_write(sql,data);

      }

      // 削除フラグが立っているコミュニケーション履歴を削除する
      for (var d=0;d<del_list.length;d++) {
        var delsql = `delete from communication_mst where (communication_id = ? and customer_id = ?);`
        var data = [
          del_list[d]["communication_id"],
          del_list[d]["customer_id"]
        ]
        await db_write(delsql,data);
      }

      // 20件超えたら古いものから削除する
      var sql = `select count(*) as count from communication_mst where customer_id = '${route.customer}';`;
      var talk_ = await db_select(sql);
      const cnt = talk_[0]["count"];
      
      if (cnt >= 20) {
        var delcus = `DELETE FROM communication_mst WHERE customer_id = '${route.customer}' AND time NOT IN (SELECT time FROM communication_mst WHERE customer_id = '${route.customer}' ORDER BY time DESC LIMIT 20);`;
        await db_write(delcus,[]);
      }

    }
  
  }
  
  function onSend(add,icon) {
    
    setLoading(true);
    
    let newMessage = [];
    newMessage[0] = {
      _id: '',
      text: '',
      image: '',
      createdAt: '',
      user: {
        _id: 1,
        name: '店舗',
        status: '',
        title: '',
        user_read:0,
      }
    }

    if (messages.length > 0) {
      newMessage[0]._id = String(Number(messages[0]._id)+1);
    } else {
      newMessage[0]._id = "1";
    }
    
    var date = new Date();

    const formatDate = (current_datetime)=>{
      let formatted_date = 
        current_datetime.getFullYear() + "-" + 
        (current_datetime.getMonth() + 1) + "-" + 
        current_datetime.getDate() + " " + 
        current_datetime.getHours() + ":" + 
        current_datetime.getMinutes() + ":" + 
        current_datetime.getSeconds();
      return formatted_date;
    }
    
    newMessage[0].createdAt = formatDate(date);
    
    if (icon === 'line'){
      
      newMessage[0].user.status = add[0];
      newMessage[0].text = add[1];
      
      let formData = new FormData();
      formData.append('ID',route.params.account);
      formData.append('pass',route.params.password);
      formData.append('customer_id',customer.main.customer_id);
      formData.append('act','get_talk');
      formData.append('LINE_flg',1);
      formData.append('note',add[1]);
      formData.append('carousel',JSON.stringify(carouselList));
      formData.append('formdata_flg',1);
      formData.append('fc_flg',global.fc_flg);
      
        fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
      {
        method: 'POST',
        header: {
          'content-type': 'multipart/form-data',
        },
        body: formData
      })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);
        setMessages(GiftedChat.append(messages, newMessage));
        setTalk(json['communication']);
        setReload(1);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
        Alert.alert("登録に失敗しました");
      })

    } else if (icon === 'edit'){
      
      newMessage[0].createdAt = add[0];
      newMessage[0].user.status = add[1];
      
      let formData = new FormData();
      formData.append('ID',route.params.account);
      formData.append('pass',route.params.password);
      formData.append('customer_id',customer.main.customer_id);
      formData.append('act','get_talk');
      formData.append('add_flg',1);
      formData.append('communication_id',newMessage[0]['_id']);
      formData.append('status',add[1]);
      formData.append('note',add[2]);
      formData.append('date',add[0]);
      formData.append('formdata_flg',1);
      formData.append('fc_flg',global.fc_flg);
      
      fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
      {
        method: 'POST',
        header: {
          'content-type': 'multipart/form-data',
        },
        body: formData
      })
      .then((response) => response.json())
      .then((json) => {
        setLoading(false);
        Alert.alert('登録しました');
        setMessages(GiftedChat.append(messages, newMessage));
        setTalk(json['communication']);
        setReload(1);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error)
        Alert.alert("登録に失敗しました");
      })

    } else if (icon === 'mail') {
      
      newMessage[0].createdAt = add[0];
      newMessage[0].user.status = add[1];
      
      if(add[3][7]) {
        var file_name = add[3][7].name;
        var match = /\.(\w+)$/.exec(file_name);
        var type = match ? `image/${match[1]}` : `image`;
      }
      
      let formData = new FormData();
      if(add[3][7]) {
        formData.append('file', { uri: add[3][7].uri, name: file_name, type });
      }
      formData.append('ID',route.params.account);
      formData.append('pass',route.params.password);
      formData.append('customer_id',customer.main.customer_id);
      formData.append('mail_flg',1);
      formData.append('html_flg',add[4]);
      formData.append('act','get_talk');
      formData.append('reservation_flg',add[3][3]?add[3][3]:'');
      formData.append('draft_flg',add[3][6]?add[3][6]:'');
      formData.append('title',add[3][2]?add[3][2]:'');
      formData.append('date',add[3][4]);
      formData.append('reservation_id',add[3][5]?add[3][5]:'');
      formData.append('mail',add[3][0]);
      formData.append('send',add[3][1]);
      formData.append('note',add[2]);
      formData.append('formdata_flg',1);
      formData.append('fc_flg',global.fc_flg);
      formData.append('reservation_date2',add[3][8]?add[3][8]:'');
      formData.append('reservation_date3',add[3][9]?add[3][9]:'');
      formData.append('reservation_stop_flg',add[3][10]);
      formData.append('reading_return_flg',add[3][11]);
      
      fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
      {
        method: 'POST',
        header: {
          'content-type': 'multipart/form-data',
        },
        body: formData,
      })
      .then((response) => response.json())
      .then((json) => {
        
        setLoading(false);
        
        if(!add[3][3] && !add[3][6]) {
          Alert.alert('送信しました');
          setMessages(GiftedChat.append(messages, newMessage));
        }
        
        if(add[3][3]) {
          Alert.alert('予約しました');
        }
        
        if(add[3][6]) {
          Alert.alert('下書き保存しました');
        }
        
        setReservation(json['customer_reservation']);
        setTalk(json['communication']);
        setReload(1);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        Alert.alert("送信に失敗しました");
      })
    }

    setInputCursorPosition(null);
  }
  
  if(menu){
    Keyboard.dismiss(); // キーボード隠す
  }

  const LibraryPermissionsCheck = async() => {

    const AsyncAlert = async () => new Promise((resolve) => {
      Alert.alert(
        `カメラロールへのアクセスが無効になっています`,
        "設定画面へ移動しますか？",
        [
          {
            text: "キャンセル",
            style: "cancel",
            onPress:() => {resolve(false)}
          },
          {
            text: "設定する",
            onPress: () => {
              Linking.openSettings();
              resolve(false)
            }
          }
        ]
      );
    });

	  // カメラロールのアクセス許可を付与
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        await AsyncAlert();
        return false;
      } else {
        return true;
      }
    }

  }
  
  // カメラロールから画像またはビデオを選択
  const pickImage = async (item) => {
    
    if (!await LibraryPermissionsCheck()) {
      setModal0(false);
      return
    }
    
    if(!customer.line){
      Alert.alert('LINE未連携です');
      setModal0(false);
    } else {
      
  	  let result = await ImagePicker.launchImageLibraryAsync({
  		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  		  allowsEditing: true,
  		  quality: 1,
  	  });
  	  
  	  if (!result.cancelled) {
        
        setLoading(true);
        setModal0(false);

        var Image_ = result.assets[0];
      
        let filename = Image_.uri.split('/').pop();
  
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        
        let formData = new FormData();
        formData.append('ID',route.params.account);
        formData.append('pass',route.params.password);
        formData.append('customer_id',customer.main.customer_id);
        formData.append('act','get_talk');
        formData.append('LINE_flg',1);
        formData.append('formdata_flg',1);
        formData.append('file', { uri: Image_.uri, name: filename, type });
        formData.append('fc_flg',global.fc_flg);
        
        fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
        {
          method: 'POST',
          body: formData,
          header: {
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => response.json())
        .then((json) => {
          setMessages(
            GiftedChat.append(messages,
              [{
                _id:String(Number(messages[0]._id)+1),
                text:'',
                image:Image_.uri,
                createdAt: new Date(),
                user:{
                  _id: 1,
                  avatar: null,
                  name: "店舗",
                  status: "LINE送信",
                  title: "",
                  user_read:0,
                }
              }]
            )
          );
          setTalk(json['communication']);
          setLoading(false);
          setReload(1);
        })
        .catch((error) => {
          console.log(error)
          setLoading(false);
          const errorMsg = "ファイルをアップできませんでした";
          Alert.alert(errorMsg);
        })
        
  	  } else {
        setLoading(false);
      }
  	  
	  }
	};
	
	// ファイル選択
	const pickDocument = async () => {
	  
    let result = await DocumentPicker.getDocumentAsync({});
    
    if(!customer.line){
      Alert.alert('LINE未連携です');
      setModal0(false);
    } else {
  	  
  	  if (!result.cancelled) {
        
        setLoading(true);
        setModal0(false)

        var File_ = result.assets[0];
      
        let filename = File_.uri.split('/').pop();
  
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        
        let formData = new FormData();
        formData.append('ID',route.params.account);
        formData.append('pass',route.params.password);
        formData.append('customer_id',customer.main.customer_id);
        formData.append('act','get_talk');
        formData.append('LINE_flg',1);
        formData.append('file_flg',1);
        formData.append('formdata_flg',1);
        formData.append('file', { uri: File_.uri, name: filename, type });
        formData.append('fc_flg',global.fc_flg);
        
        fetch(domain+'batch_app/api_system_app.php?'+Date.now(),
        {
          method: 'POST',
          body: formData,
          header: {
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => response.json())
        .then((json) => {
          
          const text = json["communication"][0]["note"];

          setMessages(
            GiftedChat.append(messages,
              [{
                _id:String(Number(messages[0]._id)+1),
                text:text,
                image:'',
                createdAt: new Date(),
                user:{
                  _id: 1,
                  avatar: null,
                  name: "店舗",
                  status: "LINE送信",
                  title: "",
                  user_read:0,
                }
              }]
            )
          );
          setTalk(json['communication']);
          setLoading(false);
          setReload(1);
        })
        .catch((error) => {
          console.log(error)
          const errorMsg = "ファイルをアップできませんでした";
          Alert.alert(errorMsg);
          setLoading(false);
        })

  	  } else {
        setLoading(false);
      }
  	  
	  }
  };
	
  const [c_permission, c_requestPermission] = useCameraPermissions();

  const CameraPermissionsCheck = async() => {

    const AsyncAlert = async () => new Promise((resolve) => {
      Alert.alert(
        `カメラへのアクセスが無効になっています`,
        "設定画面へ移動しますか？",
        [
          {
            text: "キャンセル",
            style: "cancel",
            onPress:() => {resolve(false)}
          },
          {
            text: "設定する",
            onPress: () => {
              Linking.openSettings();
              resolve(false)
            }
          }
        ]
      );
    });

    const { status } = await c_requestPermission();
    
	  // カメラのアクセス許可を付与
    if (Platform.OS !== 'web') {
      if (status !== 'granted') {
        await AsyncAlert();
        return false;
      } else {
        return true;
      }
    }

  }

  const [a_permissionResponse, a_requestPermission] = Audio.usePermissions();

  const AudioPermissionsCheck = async() => {

    const AsyncAlert = async () => new Promise((resolve) => {
      Alert.alert(
        `マイクへのアクセスが無効になっています`,
        "設定画面へ移動しますか？",
        [
          {
            text: "キャンセル",
            style: "cancel",
            onPress:() => {resolve(false)}
          },
          {
            text: "設定する",
            onPress: () => {
              Linking.openSettings();
              resolve(false)
            }
          }
        ]
      );
    });

    const { status } = await a_requestPermission();
    
	  // マイクのアクセス許可を付与
    if (Platform.OS !== 'web') {
      if (status !== 'granted') {
        await AsyncAlert();
        return false;
      } else {
        return true;
      }
    }

  }

  // オンライン通話URL挿入
	const online_call = async (id) => {
	  
	  if (!await CameraPermissionsCheck()) return;
	  if (!await AudioPermissionsCheck()) return;
    
    var url_add = "recording_login_key=tc12"+id+"46ud";
    var row     = domain+"video/?"+url_add;

    // LINE紐づけされてたら
    if (customer.line) {
      setMsgtext(msgtext?msgtext+row:row);
    } else { // されてなかったらメール作成
      setModal1(true);
      setNoto_ret(row);
    }

	  Alert.alert(
      "通話画面を開きますか？",
      "",
      [
        {
          text: "はい",
          onPress: () => {
            fetch(domain+"video/?customer_id="+id,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify({
                  id : route.params.account,
                  pass : route.params.password,
                  app_flg : 1,
                  fc_flg: global.fc_flg,
                })
              })
                .then((response) => response.json())
                .then((json) => {
                  Linking.openURL(json)
                  .catch((err) => {
                    console.log(err);
                    Alert.alert('接続に失敗しました');
                  });
                })
                .catch((error) => {
                  console.log(error)
                  Alert.alert("接続に失敗しました");
                })
          }
        },
        {
          text: "いいえ",
        },
      ]
    );
    
	}
  
  // アイコン切替
  function menuPress(name) {
    setMenu(true);
    if (name === 1) {
      if(!customer.line){
        Alert.alert('LINE未連携です');
      } else {
        setModal0(true);
      }
      
    } else if (name === 2) {
      setModal1(true);
    } else if (name === 3) {
      setModal2(true);
    } else if (name === 4) {
      setModal3(true);
      setModal3_flg("property");
    } else if (name === 5) {
      setModal4(true);
      setModal4_flg("fixed");
    } else if (name === 6) {
      setModal4(true);
      setModal4_flg("comment");
    } else if (name === 7) {
      setModal3(true);
      setModal3_flg("inquiry");
    }
  }

  const [filteredFixed, setFilteredFixed] = useState([]);
  const [filteredComment, setFilteredComment] = useState([]);

  // リストからHTMLの定型文をフィルタリング
  const filterFixedByCategory = () => {
    const filtered = fixed.filter((obj) => obj.html_flg != '1' && obj.category != 'HTML用');
    setFilteredFixed(filtered);
  }

  // リストからHTMLの一言コメントをフィルタリング
  const filteredCommentByCategory = () => {
    const filtered = comment.filter((obj) => obj.html_flg != '1' && obj.category != 'HTML用');
    setFilteredComment(filtered);
  }

  useEffect(() => {
    if (fixed.length != 0) {
      if (modal4) {
        // チャット画面の入力欄に直接定型文を挿入する時はHTMLの定型文は表示しない
        filterFixedByCategory();
      } else {
        setFilteredFixed(fixed);
      }
    }
    if (comment.length != 0) {
      if (modal4) {
        // チャット画面の入力欄に直接定型文を挿入する時はHTMLの定型文は表示しない
        filteredCommentByCategory();
      } else {
        setFilteredComment(comment);
      }
    }
  }, [modal4,fixed,comment]);
  
  const [menu_height,setMenu_height] = useState(false);
  const getHeight = (e) => {
    const height = e.nativeEvent.layout.height;
    if (height > 40) {
      setMenu_height(height-40);
    } else {
      setMenu_height(0);
    }
  }

  useEffect(() => {
    if (modal1 == false) {
      setSubject("");
      setNoto_ret("");
      setSend_mail("");
      setReceive_mail("");
    }
  }, [modal1]);

  const onLongPress = (context, message) => {
    var options = [];

    if (message.user.status == 'メール受信') {
      options = ['返信','キャンセル'];
    } else {
      return null;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const cancelButtonIndex = options.length - 1;

    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex) => {
      switch (options[buttonIndex]) {
        case '返信':

          var sql = `select * from communication_mst where customer_id = '${route.customer}' and communication_id = '${message._id}';`;
          db_select(sql).then(function(data) {
            if (data != false) {
              var result = data[0];

              // 件名
              setSubject("Re:"+result.title);

              // 本文
              var note  = "-----Original Message-----\n";
              note += "Sent:"+result.time+"\n";
              note += "Subject:"+result.title+"\n\n";
              note += result.note;
              setNoto_ret(note);

              // 送信元（お客様のアドレス）
              setSend_mail(result.send_mail);

              // 宛先（スタッフ）
              setReceive_mail(result.receive_mail);

              setMenu(true);
              setModal1(true);
            } else {
              
              // 件名
              setSubject("Re:"+message.user.title);

              // 本文
              var note  = "-----Original Message-----\n";
              note += "Sent:"+message.createdAt+"\n";
              note += "Subject:"+message.user.title+"\n\n";
              note += message.text;
              setNoto_ret(note);
              
              setMenu(true);
              setModal1(true);
            }
          })

          break;
        default:
          break;
      }
    });

  }
  
  const headerRight = useMemo(() => {
    if (customer && options) {
      return (
        <View style={{backgroundColor:'#fff',flex:1,paddingTop:25}}>
          <TouchableOpacity
            style={styles.menulist}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "CustomerEdit",
                    params: route.params,
                    websocket: route.websocket,
                    websocket2: route.websocket2,
                    profile: route.profile,
                    customer: route.customer,
                    customer_data: customer,
                    cus_name:route.cus_name,
                    contract: customer["cjs_contract"],
                    previous:'TalkScreen'
                  },
                ],
              });
            }}
          >
            <MaterialCommunityIcons
              name="account-cog"
              color={global.fc_flg?"#fd2c77":"#1d449a"}
              size={30}
            />
            <Text style={styles.menutext}>お客様編集</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menulist}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "ContractRegister",
                    params: route.params,
                    websocket: route.websocket,
                    websocket2: route.websocket2,
                    profile: route.profile,
                    hojin:false,
                    customer: route.customer,
                    customer_data: customer,
                    cus_name:route.cus_name,
                    contract: customer["contract"],
                    contract_sms: contract_sms,
                    options:options,
                    previous:'TalkScreen'
                  },
                ],
              });
            }}
          >
            <MaterialCommunityIcons
              name="file-table"
              color={global.fc_flg?"#fd2c77":"#1d449a"}
              size={30}
            />
            <Text style={styles.menutext}>契約進行表</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menulist}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "ContractRegister",
                    params: route.params,
                    websocket: route.websocket,
                    websocket2: route.websocket2,
                    profile: route.profile,
                    hojin:true,
                    customer: route.customer,
                    customer_data: customer,
                    cus_name:route.cus_name,
                    contract: customer["cjs_contract"],
                    contract_sms: contract_sms,
                    options:options,
                    previous:'TalkScreen'
                  },
                ],
              });
            }}
          >
            <MaterialCommunityIcons
              name="file-account"
              color={global.fc_flg?"#fd2c77":"#1d449a"}
              size={30}
            />
            <Text style={styles.menutext}>契約進行表(法人)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menulist}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "ErcMoveIn",
                    params: route.params,
                    websocket: route.websocket,
                    websocket2: route.websocket2,
                    profile: route.profile,
                    customer: route.customer,
                    cus_name:route.cus_name,
                    options:options,
                    line_flg:customer.line,
                    previous:'TalkScreen'
                  },
                ],
              });
            }}
          >
            <MaterialCommunityIcons
              name="home-edit"
              color={global.fc_flg?"#fd2c77":"#1d449a"}
              size={30}
            />
            <Text style={styles.menutext}>入居申込書</Text>
          </TouchableOpacity>
        </View>
      )
    }
  },[customer,options,contract_sms])

  return (
    <SideMenu
      menu={headerRight}
      isOpen={sidemenu}
      onChange={isOpen => {
        setSideMenu(isOpen);
      }}
      menuPosition={'right'}
      openMenuOffset={Width * 0.5}
    >
      <Loading isLoading={isLoading} />
      {customer.main&&(
        <>
        <TouchableOpacity
          style={{backgroundColor:'#ccc',paddingHorizontal:10,paddingVertical:3}}
          onPress={()=>setModal7(true)}
          activeOpacity={1}
        >
          <Text style={{fontSize:12}} numberOfLines={1}>メモ：{customer.main.memo??customer.main.memo}</Text>
        </TouchableOpacity>
        <MyModal7
          isVisible={modal7}
          setModal7={setModal7}
          onClose={()=>{setModal7(false)}}
          route={route}
          customer_id={customer.main.customer_id}
          memo={customer.main.memo}
          setCustomer={setCustomer}
        />
        </>
      )}
      {(typeof customer === "object" && ("beginning_communication" in customer) && (customer.beginning_communication != null)) && (
        <>
        <MyModal6
          isVisible={modal6}
          route={route}
          overlap={overlap}
          navigation={navigation}
          
          //modal5
          cus={customer}
          options={options}
          tantou={tantou}
          station_list={station}
          address={address}
          setReload={setReload}
          setReload2={setReload2}
        />
        <MyModal5
          isVisible={modal6?false:modal5}
          route={route}
          cus={customer}
          navigation={navigation}
          options={options}
          tantou={tantou}
          station_list={station}
          address={address}
          setReload={setReload}
          setReload2={setReload2}
          setModal6={setModal6}
        />
        </>
      )}
      <GiftedChat
        messages={messages}
        
        // メッセージ画面を押したときのイベント
        messageOnPress={() => setMenu(false)}
        text={msgtext?msgtext:''}
        onInputTextChanged={text => {setMsgtext(text)}}
        placeholder={customer.line?"テキストを入力してください":""}
        disableComposer={(customer.line&&customer!=false)&&carouselList.length==0?false:true}
        onSend={() => onSend(['LINE送信',msgtext],'line')}
        dateFormat={'MM/DD(ddd)'}
        renderMessage={(props) => {
          return (
            <GestureRecognizer
              onSwipeRight={()=>{backAction()}}
              config={{
                velocityThreshold: 0.8,
                directionalOffsetThreshold: 150,
              }}
              style={{flex: 1}}
            >
              <Message {...props} />
            </GestureRecognizer>
          );
        }}
        renderBubble={renderBubble}
        onPress={()=>{}}
        onLongPress={onLongPress}
        renderUsernameOnMessage={false}
        renderStatus={true}
        renderTitle={true}
        renderSend={(props) => {
          return (
            <Send {...props} containerStyle={styles.sendContainer}>
              <Feather name='send' color='#fff' size={25} />
            </Send>
          );
        }}
        renderComposer={(props) => {
          if (!customer.line) {
            return (
              <TouchableOpacity
                style={styles.menu_btn}
                activeOpacity={1}
                onPress={() => setMenu(!menu)}
              >
                <Text style={styles.menu_btn_text}>メニュー ▼</Text>
              </TouchableOpacity>
            )
          } else {
            return (
              <Composer
                {...props}
                textInputProps={{
                  ...props.textInputProps,
                  onSelectionChange: (event) => setInputCursorPosition(event.nativeEvent.selection)
                }}
              />
            )
          }
        }}
        renderMessageText={renderMessageText}
        renderCustomView={renderCarouselView}
        extraData={{currentIndex}}
        shouldUpdateMessage = {(props, nextProps) => {
          return props.extraData.currentIndex !== nextProps.extraData.currentIndex
        }}
        renderMessageImage={(props)=>{
          if (Array.isArray(props.currentMessage.image)) {
            var tmpStyle = {};
            if (props.currentMessage.text == "") {
              tmpStyle = {marginBottom:8,marginRight:10};
            }
            const images = (props.currentMessage.image).map((img,index)=>{
              return (
                <TouchableOpacity style={tmpStyle} onPress={() => {Linking.openURL(img)}}>
                  <Text style={styles.file_url}>添付{index+1}</Text>
                </TouchableOpacity>
              )
            })
            return images;
          } else if (props.currentMessage.user.title == "スタンプ" && props.currentMessage.image) {
            return (
              <Image style={styles.image} source={{ uri: props.currentMessage.image }}/>
            )
          } else {
            return null;
          }
        }}
        user={{_id: 1,text:msgtext}}
        textInputStyle={styles.textInput}
        textStyle={{color: "black"}}
        listViewProps={{
          style: {
            backgroundColor: '#fff',
          },
        }}
        keyboardShouldPersistTaps={'never'}
        // 入力欄クリックした時のイベント
        textInputProps = {{
          onFocus: () => setMenu(false),
          autoFocus:focus
        }}
        // プラスボタン
        renderActions={(props) => {
          return (
            // 選択されている送信ツール（LINE、メール、行動内容）のアイコン表示
            <Actions {...props} icon={() => <Feather name={'menu'} color={"#fff"} size={25} />} />
          );
        }}
        // ↑を押したときのイベント
        onPressActionButton={() => {
          if (customer != false) {
            setMenu(!menu);
          }
        }}
        // メニュー開いたらメッセージも上に表示する
        minInputToolbarHeight={30}
        messagesContainerStyle={[
          menu&&{paddingBottom:190},
          {backgroundColor:'#f1f1f1'}
          // menu&&menu_height?
          //   Platform.select({
          //     ios: {height:400-menu_height},
          //     android: {height:550-menu_height},
          //   })
          //   :null,
        ]}
        
        onLayout={(e) => getHeight(e)}
        maxComposerHeight={150}
        
        // 入力欄の下のスペース
        bottomOffset={Platform.select({ios: 15})} // 入力欄下の謎のすき間埋める(iosのみ)
        renderInputToolbar={(props) => (
            <InputToolbar {...props}
            editable={false}
              containerStyle={[{
                backgroundColor:!global.fc_flg?"#6C9BCF":"#FF8F8F"},
                menu?{height:255}:'',
                menu&&menu_height?{height:255+menu_height}:'',
              ]}
            />
          )
        }
        // ↑の中身
        renderAccessory={(props) =>
          <View
            style={[
              styles.border,
              !menu?{display:'none'}:'',
            ]}
          >
            <View style={[styles.menu,{marginTop:15}]}>
              <TouchableOpacity style={!customer.line?{display:"none"}:styles.menuBox} onPress={()=>menuPress(1)} >
                <Feather name='message-circle' color='#404040' size={30} />
                <Text style={styles.iconText}>LINE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBox} onPress={()=>menuPress(2)} >
                <Feather name='mail' color='#404040' size={28} />
                <Text style={styles.iconText}>メール</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBox} onPress={()=>menuPress(3)} >
                <Feather name='edit' color='#404040' size={25} />
                <Text style={styles.iconText}>行動内容</Text>
              </TouchableOpacity>
              <TouchableOpacity style={video_option?styles.menuBox:{display:"none"}} onPress={() =>online_call(route.customer)}>
                <Feather name='video' color='#404040' size={28} />
                <Text style={styles.iconText}>オンライン{"\n"}通話</Text>
              </TouchableOpacity>
              <MyModal0
                isVisible={modal0}
                onSwipeComplete={() => { setModal0(false) }}
                onPress={()=>{ setModal0(false) }}
                send_image={()=>pickImage()}
                pickDocument={() => pickDocument()}
              />
              <MyModal1
                isVisible={modal1}
                setModal1={setModal1}
                reservation={reservation}
                shop_mail={[
                  staff.system_mail,
                  staff.yahoomail,
                  staff.gmail,
                  staff.hotmail,
                  staff.outlook,
                  staff.softbank,
                  staff.icloud,
                  staff.original_mail
                ]}
                cus_mail={customer.main?[
                  customer.main.mail1,
                  customer.main.mail2,
                  customer.main.mail3
                ]:[]}
                setMail={setMail}
                subject={subject}
                note_ret={note_ret}
                send_mail={send_mail}
                route={route}
                onSend={onSend}
                property={property}
                inquiry={inquiry}
                station_list={station}
                address={address}
                c_d={conditions_date}
                fixed={fixed}
                comment={comment}
                hensu={customer.main?[
                  // 定型文で使うもの
                  customer.main.name,
                  staff.corporations_name,
                  staff.name,
                  customer.reverberation.staff_name,
                  route.params.name_1+' '+route.params.name_2,
                  customer.reverberation.media,
                  inquiry_text,
                  staff.tel,
                  staff.fax,
                  inquiry_name,
                  customer.reverberation.inquiry_day,
                ]:[]}
                mail_set={
                  receive_mail?
                  {
                    brower_mail:receive_mail,
                    mail_select:staff.mail_select,
                  }:
                  customer.main?
                  {
                    brower_mail:customer.main.brower_mail,
                    mail_select:staff.mail_select,
                  }
                  :
                  ''}
                options={video_option}
                options2={options}
              />
              <MyModal2
                isVisible={modal2}
                setModal2={setModal2}
                onClose={()=>{
                  if(add[1]){
                    setModal2(false);
                  } else {
                    Alert.alert('確定を押してください');
                  }
                }}
                setAdd={setAdd}
                onSend={onSend}
              />
            </View>
            <View style={!customer.line?{display:"none"}:styles.menu}>
              <TouchableOpacity style={styles.menuBox} onPress={()=>menuPress(4)}>
                <Feather name='home' color='#404040' size={28} />
                <Text style={styles.iconText}>オススメ{"\n"}物件</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBox}onPress={()=>menuPress(5)}>
                <Feather name='file-text' color='#404040' size={28} />
                <Text style={styles.iconText}>定型文</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBox}onPress={()=>menuPress(6)}>
                <MaterialCommunityIcons name='comment-processing-outline' color='#404040' size={28} />
                <Text style={styles.iconText}>一言コメント</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBox}onPress={()=>menuPress(7)}>
                <MaterialCommunityIcons name='home-import-outline' color='#404040' size={28} />
                <Text style={styles.iconText}>問合せ物件</Text>
              </TouchableOpacity>
              
              <MyModal3 {...props}
                isVisible={modal3}
                onSwipeComplete={() => { setModal3(false) }}
                onClose={()=>{ setModal3(false) }}
                route={route}
                property={property}
                inquiry={inquiry}
                flg={modal3_flg}
                station_list={station}
                address={address}
                c_d={conditions_date}
                msgtext={props.user.text}
                setMsgtext={setMsgtext}
                inputCursorPosition={inputCursorPosition}
                mail_format={'0'}
                line_flg={true}
                setCarouselList={setCarouselList}
              />
              <MyModal4
                isVisible={modal4}
                onSwipeComplete={() => { setModal4(false) }}
                onPress={()=>{ setModal4(false) }}
                flg={modal4_flg}
                fixed={filteredFixed}
                comment={filteredComment}
                msgtext={msgtext}
                subject={subject}
                setMsgtext={setMsgtext}
                setSubject={setSubject}
                inputCursorPosition={inputCursorPosition}
                mail_format={'0'}
                setModal4={setModal4}
                hensu={customer.main?[
                  customer.main.name,
                  staff.corporations_name,
                  staff.name,
                  customer.reverberation.staff_name,
                  route.params.name_1+' '+route.params.name_2,
                  customer.reverberation.media,
                  inquiry_text,
                  staff.tel,
                  staff.fax,
                  inquiry_name,
                  customer.reverberation.inquiry_day,
                ]:[]}
              />
            </View>
          </View>
        }
      />
    </SideMenu>
  )

}

const styles = StyleSheet.create({
  name: {
    color:'#ffffff',
    fontSize:18,
    fontWeight:'500'
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
  },
  menu_btn:{
    flex:1,
    alignItems: 'center',
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  menu_btn_text:{
    color:'#ffffff',
    fontSize:20,
  },
  textInput: {
    marginTop:5,
    marginRight: 10,
    borderRadius: 10,
    paddingLeft: 5,
    backgroundColor: "white",
    paddingTop: 8,
    lineHeight:20,
    textAlignVertical:'top',
  },
  border: {
    backgroundColor:'#b4b4b4',
    height:210,
  },
  menu: {
    marginVertical:8,
    width:364,
    height:80,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  menuBox: {
    width:80,
    height:80,
    backgroundColor:'#fafafa',
    borderWidth:1.5,
    borderColor:'#404040',
    borderRadius:20,
    marginHorizontal:5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize:12,
    fontWeight:'600',
    color:'#404040',
    marginTop:5,
    textAlign:'center',
  },
  menulist: {
    flexDirection:'row',
    marginLeft:10,
    marginVertical:10,
    alignItems:'center',
    height:40,
  },
  menutext: {
    fontSize:16,
    marginLeft:10
  },
  file_url :{
    fontSize:12,
    color:'blue',
    marginLeft:10,
    marginTop:5,
    textDecorationLine: 'underline'
  },
  image: {
    width: 150,
    height: 130,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  carousel: {
    flexDirection:'row',
    alignItems:'center',
    position:'relative'
  },
  carouselTxt: {
    fontSize:12,
    marginBottom:3,
    color:'#999',
  },
  carouselBtn: {
    position:'absolute',
    zIndex:999,
    width:35,
    height:35,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:100
  },
  property: {
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'#666',
    padding:10,
    marginRight:10,
  },
  propertyTitle: {
    height:50,
    fontSize:16,
    backgroundColor:'#D9EEF4',
    padding:2,
    marginTop:10,
  },
  propertyInfo:{
    marginVertical:5,
  },
  propertyPhoto: {
    width:"100%",
    height:150
  },
  propertyBtn: {
    paddingVertical:5,
    backgroundColor:'#999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:100,
    marginTop:5
  },
  propertyBtn_txt: {
    textAlign:'center',
    color:'#fff',
    fontSize:14,
    letterSpacing:5,
    fontWeight:'700'
  },
});
