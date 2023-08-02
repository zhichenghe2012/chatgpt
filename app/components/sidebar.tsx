import { useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        const n = chatStore.sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = chatStore.currentSessionIndex;
        if (e.key === "ArrowUp") {
          chatStore.selectSession(limit(i - 1));
        } else if (e.key === "ArrowDown") {
          chatStore.selectSession(limit(i + 1));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();

  useHotKey();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${shouldNarrow && styles["narrow-sidebar"]
        }`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>ChatGpt</div>
        <div className={styles["sidebar-sub-title"]}>
          添加微信替换为个人定制微信号 提供更多技术支持
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <ChatGptIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          // text={shouldNarrow ? undefined : Locale.Mask.Name}
          text='聊天摸版'
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.NewChat, { state: { fromHome: true } })}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          // text={shouldNarrow ? undefined : Locale.Plugin.Name}
          text={shouldNarrow ? undefined : Locale.Plugin.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => showToast(Locale.WIP)}
          shadow
        />
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://test-cr534q4ghsv6.feishu.cn/wiki/XwOLwvPoViRbgYkesEbcGc8Nncb" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='ChatGPT提问入门指南'
            shadow
          />
        </a>
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://test-cr534q4ghsv6.feishu.cn/wiki/QNzjwl2mdifCGDkz2gBcegXln0b" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='AI知识库访问(持续更新）'
            shadow
          />
        </a>
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://test-cr534q4ghsv6.feishu.cn/wiki/OA0XwHFoVieVH4kXfsfcGEM2n5b" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='AI工具保姆级指导书(持续更新）'
            shadow
          />
        </a>
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://prm.chatgptvip.info/" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='ChatGPT 提示词工具'
            shadow
          />
        </a>
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://test-cr534q4ghsv6.feishu.cn/wiki/Cq8ywC9t6ib59SkLYkjcUNw9ntd" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='企业独立ChatGpt站点'
            shadow
          />
        </a>
      </div>

      <div className={styles["sidebar-bar-button"]}>
        <a href="https://test-cr534q4ghsv6.feishu.cn/wiki/SYVUwUhAViLxFRkuSQKcvQx9nQe" target="_blank">
          <IconButton
            icon={<GithubIcon />}
            text='500元搭建企业官网或外贸独立站'
            shadow
          />
        </a>
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => {
                if (confirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          {/* <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div> */}
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton
                icon={<SettingsIcon />}
                text='访问密码配置'
                shadow
              />
            </Link>
          </div>
          {/* <div className={styles["sidebar-action"]}>
            <a href="https://chatgptvip.shop/chatgpt%e4%b8%ad%e6%96%87%e8%b0%83%e6%95%99%e6%8c%87%e5%8d%97" target="_blank">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div> */}
        </div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.NewChat);
              }
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
    </div>
  );
}
