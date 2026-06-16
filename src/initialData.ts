import { Pet, UserProfile, AdoptionApplication } from "./types";

export const INITIAL_PETS: Pet[] = [
  {
    id: "pet_harvey",
    name: "哈比",
    category: "狗狗",
    breed: "金毛混血儿",
    age: "2岁",
    gender: "公",
    weight: "12kg",
    status: "寻找领养中",
    location: "领养中心",
    distance: "1.5km",
    description: "哈比是一只非常懂事的金毛混血儿。他在我们的救助站里是公认的“开心果”，性格活泼，非常亲人。无论见到谁都会摇着尾巴热情迎接。他已经学会了简单的指令，如“坐下”和“握手”，非常聪明且渴望学习。",
    tags: ["亲近人类", "聪明好学", "活力充沛"],
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=500&fit=crop",
    health: {
      vaccination: "已完成 (狂犬/联苗)",
      neutered: "已绝育",
      dewormed: "定期进行中"
    },
    requirements: [
      "在本地有固定住所，且房东或家人同意养犬。",
      "愿意为哈比提供科学的饮食和必要的医疗保障。",
      "能够保证每天有充足的遛狗时间，陪伴他运动。",
      "接受领养回访，签订领养协议。"
    ]
  },
  {
    id: "pet_qiuqiu",
    name: "球球",
    category: "猫咪",
    breed: "英短蓝猫",
    age: "2岁",
    gender: "母",
    weight: "4.2kg",
    status: "已接种",
    location: "猫咪之家",
    distance: "2.4km",
    description: "球球是一只文静可爱的英短蓝猫。平时喜欢安安静静地趴在阳台上晒太阳，偶尔也会主动蹭人撒娇，非常温顺。希望为她寻找一个温暖、充满爱心的家庭。",
    tags: ["温顺优雅", "文静安详", "软萌可亲"],
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=500&fit=crop",
    health: {
      vaccination: "已完成 (狂犬/联苗)",
      neutered: "已绝育",
      dewormed: "定期进行中"
    },
    requirements: [
      "在本地有稳定住所，谢绝散养。",
      "科学喂养，愿意为其提供良好的生存空间。",
      "接受领养回访并定期分享宝宝近况。"
    ]
  },
  {
    id: "pet_doudou",
    name: "豆豆",
    category: "狗狗",
    breed: "金毛巡回犬",
    age: "3个月",
    gender: "公",
    weight: "8.5kg",
    status: "待领养",
    location: "新苗庇护所",
    distance: "5.8km",
    description: "年轻可爱的金毛幼犬，性格活泼黏人。吃喝拉撒均良好，对探索新事物充满激情。目前有简单好习惯雏形，是非常优秀的小伴侣。",
    tags: ["活泼黏人", "聪明乖巧", "吃货小狗"],
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop",
    health: {
      vaccination: "幼犬前两针已接种",
      neutered: "未绝育 (适龄时可做)",
      dewormed: "已做体内外驱虫"
    },
    requirements: [
      "有充足时间照料和陪伴小狗长大。",
      "同意适龄进行绝育手术。",
      "接受领养前家访，保证爱护一生。"
    ]
  },
  {
    id: "pet_nuomi",
    name: "糯米",
    category: "小动物",
    breed: "垂耳兔",
    age: "1岁",
    gender: "母",
    weight: "1.5kg",
    status: "待领养",
    location: "兔兔庇护站",
    distance: "0.8km",
    description: "糯米长着一双让人融化的下垂大耳朵。极其温顺安静，特别喜欢吃新鲜的提摩西草。当你抚摸她额头时，她会享受得闭上双眼，非常讨喜。",
    tags: ["安静温顺", "乖巧容易打理", "手感一流"],
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=500&fit=crop",
    health: {
      vaccination: "兔瘟/兔巴氏杆菌疫苗已打",
      neutered: "未绝育",
      dewormed: "已完成定期预防"
    },
    requirements: [
      "配备专业大兔笼，拒绝长期关进极小笼中。",
      "严禁将其作为玩具给不懂事的儿童任意摆弄。",
      "具备科学养兔常识，主食牧草，水分适度。"
    ]
  },
  {
    id: "pet_dazhuang",
    name: "大壮",
    category: "狗狗",
    breed: "柯基犬",
    age: "3岁",
    gender: "公",
    weight: "11.5kg",
    status: "已绝育",
    location: "柯基救助基金",
    distance: "1.2km",
    description: "大壮性格开朗，是名副其实的柯基。拥有大大的招牌笑容，精力非常充沛，热爱户外活动、海滩奔跑。对人极其友好，非常社会化。",
    tags: ["短腿狂奔", "乐天微笑", "社交小达人"],
    image: "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=400&h=500&fit=crop",
    health: {
      vaccination: "已完成 (联苗/狂犬)",
      neutered: "已绝育",
      dewormed: "定期进行中"
    },
    requirements: [
      "房东及同居家庭成员百分百支持。",
      "每日至少提供40分钟以上充足运动散步时间。",
      "拒绝任何形式的暴力惩罚教育，主张正向引导。"
    ]
  },
  {
    id: "pet_juzi",
    name: "橘子",
    category: "猫咪",
    breed: "中华田园猫",
    age: "1.5岁",
    gender: "公",
    weight: "5.0kg",
    status: "已绝育",
    location: "阳光猫舍",
    distance: "4.5km",
    description: "橘子特别爱撒娇，只要你一摸他，他就会呼噜个不停。性格老实本分，与其他猫咪相处极其融洽。橘猫特别爱吃，正朝着圆润的标准体态稳步发展中。",
    tags: ["大橘为重", "呼噜大王", "老实粘人"],
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=500&fit=crop",
    health: {
      vaccination: "已接种猫三联与狂犬",
      neutered: "已绝育",
      dewormed: "每三个月体内外驱虫"
    },
    requirements: [
      "全屋必须安装结实的防猫金刚网纱窗。",
      "接受微信/视频等不定期的领养回访。",
      "喂食中高端天然粮，生病时能够积极治疗。"
    ]
  },
  {
    id: "pet_naihuang",
    name: "奶黄",
    category: "小动物",
    breed: "金丝熊",
    age: "6个月",
    gender: "母",
    weight: "150g",
    status: "寻找领养中",
    location: "仓鼠之家",
    distance: "3.1km",
    description: "毛发蓬松，像一颗胖乎乎的小雪球的仓鼠宝宝。超级自律，很喜欢在静音跑轮上狂奔。在手上时非常乖巧，喜欢塞满满嘴的瓜子然后呆萌发呆，解压圣物！",
    tags: ["萌爆吃货", "黑夜跑步达人", "温驯不咬人"],
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=500&fit=crop",
    health: {
      vaccination: "无需接种疫苗",
      neutered: "未绝育",
      dewormed: "健康无寄生虫"
    },
    requirements: [
      "严禁单笼合养（仓鼠极度领地化，合必伤）。",
      "提供科学健康的基础垫料、跑轮及坚果餐食。",
      "谢绝将生命当做一时兴起的儿童一次性玩具。"
    ]
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "林小暖",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  bio: "用心守护每一个毛孩子",
  stationsWatched: 12,
  successfulAdoptions: 3
};

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: "app_1",
    petId: "pet_qiuqiu",
    petName: "球球",
    petImage: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop",
    phone: "13512345678",
    environment: "两室一厅，阳台已安装防猫金刚网，光照条件好",
    ownership: "自有住宅",
    experience: "以前养过一只田园猫，陪伴了她五年，对其习性较为了解",
    intent: "希望能给生命第二次机会，陪伴新成员健康快乐成长",
    status: "审核中",
    progressStep: 2,
    dateSubmitted: "2026-06-12"
  },
  {
    id: "app_2",
    petId: "pet_harvey",
    petName: "哈比",
    petImage: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=100&h=100&fit=crop",
    phone: "13512345678",
    environment: "大平层，带有一个50平的封闭小花园，适合金毛活动",
    ownership: "自有住宅",
    experience: "养过雪纳瑞，了解基本狗狗服从性常识及看护常识",
    intent: "看到哈比温暖诚恳的眼神，心中极其感动，希望能把他接回家做一辈子的家人",
    status: "待审核",
    progressStep: 1,
    dateSubmitted: "2026-06-15"
  }
];
