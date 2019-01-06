//
// Copyright (c) 2013 Juan Palacios juan.palacios.puyana@gmail.com
// Subject to the BSD 2-Clause License
// - see < http://opensource.org/licenses/BSD-2-Clause>
//
// Source:
// https://github.com/juanchopanza/cppblog/blob/master/Concurrency/Queue/Queue.h

#ifndef CONCURRENT_QUEUE_H__
#define CONCURRENT_QUEUE_H__

#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>

template <typename T>
class ConcurrentQueue
{
 public:

  bool empty() {
    std::unique_lock<std::mutex> mlock(mutex_);
    bool res = queue_.empty();
    mlock.unlock();
    return res;
  }

  T pop()
  {
    std::unique_lock<std::mutex> mlock(mutex_);
    while (queue_.empty())
    {
      cond_.wait(mlock);
    }
    auto val = queue_.front();
    queue_.pop();
    return val;
  }

  void pop(T& item)
  {
    std::unique_lock<std::mutex> mlock(mutex_);
    while (queue_.empty())
    {
      cond_.wait(mlock);
    }
    item = queue_.front();
    queue_.pop();
  }

  void push(const T& item)
  {
    std::unique_lock<std::mutex> mlock(mutex_);
    queue_.push(item);
    mlock.unlock();
    cond_.notify_one();
  }
  ConcurrentQueue() = default;
  ConcurrentQueue(const ConcurrentQueue&) = delete;            // disable copying
  ConcurrentQueue& operator=(const ConcurrentQueue&) = delete; // disable assignment
  // move constructor
  ConcurrentQueue(ConcurrentQueue && a) : queue_(std::move(a.queue_)) {}

 private:
  std::queue<T> queue_;
  std::mutex mutex_;
  std::condition_variable cond_;
};

#endif  // CONCURRENT_QUEUE_H__
